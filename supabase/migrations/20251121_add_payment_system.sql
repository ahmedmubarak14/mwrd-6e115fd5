-- Payment & Invoicing System with Moyasar Integration
-- PRD Section 5.4: Payment & Invoicing
-- Supports credit cards, Apple Pay, STC Pay, and Mada cards

-- Payment methods table (stored payment methods for users)
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  moyasar_token TEXT, -- Moyasar card token
  card_brand TEXT, -- visa, mastercard, mada
  card_last_four TEXT,
  card_name TEXT,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,

  -- Moyasar payment details
  moyasar_payment_id TEXT UNIQUE,
  moyasar_status TEXT, -- initiated, paid, failed, authorized, captured, refunded

  -- Transaction details
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'SAR',
  description TEXT,

  -- Payment method used
  payment_type TEXT, -- creditcard, applepay, stcpay
  card_brand TEXT,
  card_last_four TEXT,

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')),
  failure_reason TEXT,

  -- Refund tracking
  refunded_amount NUMERIC(12, 2) DEFAULT 0,
  refund_reason TEXT,

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB,

  -- Timestamps
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds table
CREATE TABLE IF NOT EXISTS payment_refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_transaction_id UUID NOT NULL REFERENCES payment_transactions(id) ON DELETE CASCADE,
  moyasar_refund_id TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  failure_reason TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment gateway settings (admin configurable)
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'moyasar',
  is_enabled BOOLEAN DEFAULT true,
  is_test_mode BOOLEAN DEFAULT true,

  -- API credentials (encrypted in production)
  api_key_live TEXT,
  api_key_test TEXT,
  publishable_key_live TEXT,
  publishable_key_test TEXT,

  -- Settings
  supported_currencies TEXT[] DEFAULT ARRAY['SAR'],
  supported_payment_methods TEXT[] DEFAULT ARRAY['creditcard', 'applepay', 'stcpay'],
  auto_capture BOOLEAN DEFAULT true,

  -- Fees and limits
  transaction_fee_percentage NUMERIC(5, 2) DEFAULT 2.85, -- Moyasar's typical fee
  transaction_fee_fixed NUMERIC(10, 2) DEFAULT 0,
  min_transaction_amount NUMERIC(12, 2) DEFAULT 1.00,
  max_transaction_amount NUMERIC(12, 2) DEFAULT 999999.99,

  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default payment settings
INSERT INTO payment_settings (provider, is_test_mode)
VALUES ('moyasar', true)
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
  ON payment_methods FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
  ON payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
  ON payment_methods FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
  ON payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own transactions"
  ON payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON payment_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON payment_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all transactions"
  ON payment_transactions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for payment_refunds
CREATE POLICY "Users can view own refunds"
  ON payment_refunds FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM payment_transactions
      WHERE id = payment_refunds.payment_transaction_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all refunds"
  ON payment_refunds FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for payment_settings
CREATE POLICY "Admins can view payment settings"
  ON payment_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update payment settings"
  ON payment_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create payment transaction
CREATE OR REPLACE FUNCTION create_payment_transaction(
  p_invoice_id UUID,
  p_amount NUMERIC,
  p_payment_method_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id UUID;
  v_user_id UUID;
  v_min_amount NUMERIC;
  v_max_amount NUMERIC;
BEGIN
  -- Get user from invoice
  SELECT client_id INTO v_user_id
  FROM invoices
  WHERE id = p_invoice_id;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invoice not found');
  END IF;

  -- Verify ownership
  IF auth.uid() != v_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Check payment limits
  SELECT min_transaction_amount, max_transaction_amount
  INTO v_min_amount, v_max_amount
  FROM payment_settings
  WHERE is_enabled = true
  LIMIT 1;

  IF p_amount < v_min_amount THEN
    RETURN jsonb_build_object('success', false, 'error', format('Amount must be at least %s SAR', v_min_amount));
  END IF;

  IF p_amount > v_max_amount THEN
    RETURN jsonb_build_object('success', false, 'error', format('Amount must not exceed %s SAR', v_max_amount));
  END IF;

  -- Create transaction
  INSERT INTO payment_transactions (
    user_id,
    invoice_id,
    payment_method_id,
    amount,
    currency,
    description,
    status
  ) VALUES (
    v_user_id,
    p_invoice_id,
    p_payment_method_id,
    p_amount,
    'SAR',
    p_description,
    'pending'
  ) RETURNING id INTO v_transaction_id;

  RETURN jsonb_build_object(
    'success', true,
    'transaction_id', v_transaction_id
  );
END;
$$;

-- Function to process refund
CREATE OR REPLACE FUNCTION process_refund(
  p_transaction_id UUID,
  p_amount NUMERIC,
  p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_refund_id UUID;
  v_transaction RECORD;
  v_total_refunded NUMERIC;
BEGIN
  -- Get transaction details
  SELECT * INTO v_transaction
  FROM payment_transactions
  WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction not found');
  END IF;

  -- Check if admin
  IF NOT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Check if transaction can be refunded
  IF v_transaction.status NOT IN ('completed', 'partially_refunded') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction cannot be refunded');
  END IF;

  -- Calculate total refunded amount
  v_total_refunded := COALESCE(v_transaction.refunded_amount, 0) + p_amount;

  IF v_total_refunded > v_transaction.amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Refund amount exceeds transaction amount');
  END IF;

  -- Create refund record
  INSERT INTO payment_refunds (
    payment_transaction_id,
    amount,
    reason,
    status,
    processed_by
  ) VALUES (
    p_transaction_id,
    p_amount,
    p_reason,
    'pending',
    auth.uid()
  ) RETURNING id INTO v_refund_id;

  -- Update transaction
  UPDATE payment_transactions
  SET
    refunded_amount = v_total_refunded,
    status = CASE
      WHEN v_total_refunded >= amount THEN 'refunded'
      ELSE 'partially_refunded'
    END,
    updated_at = NOW()
  WHERE id = p_transaction_id;

  RETURN jsonb_build_object(
    'success', true,
    'refund_id', v_refund_id,
    'refunded_amount', v_total_refunded
  );
END;
$$;

-- Function to get payment statistics
CREATE OR REPLACE FUNCTION get_payment_statistics(
  p_user_id UUID DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stats JSONB;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if admin
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) INTO v_is_admin;

  -- If not admin, can only view own stats
  IF NOT v_is_admin AND (p_user_id IS NULL OR p_user_id != auth.uid()) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Calculate statistics
  WITH payment_stats AS (
    SELECT
      COUNT(*) as total_transactions,
      COUNT(*) FILTER (WHERE status = 'completed') as successful_transactions,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_transactions,
      COUNT(*) FILTER (WHERE status IN ('refunded', 'partially_refunded')) as refunded_transactions,
      SUM(amount) FILTER (WHERE status = 'completed') as total_amount,
      SUM(refunded_amount) as total_refunded,
      AVG(amount) FILTER (WHERE status = 'completed') as avg_transaction_amount
    FROM payment_transactions
    WHERE (p_user_id IS NULL OR user_id = p_user_id)
      AND (p_start_date IS NULL OR created_at::DATE >= p_start_date)
      AND (p_end_date IS NULL OR created_at::DATE <= p_end_date)
  )
  SELECT jsonb_build_object(
    'success', true,
    'total_transactions', COALESCE(total_transactions, 0),
    'successful_transactions', COALESCE(successful_transactions, 0),
    'failed_transactions', COALESCE(failed_transactions, 0),
    'refunded_transactions', COALESCE(refunded_transactions, 0),
    'total_amount', COALESCE(total_amount, 0),
    'total_refunded', COALESCE(total_refunded, 0),
    'avg_transaction_amount', COALESCE(avg_transaction_amount, 0),
    'success_rate', CASE
      WHEN COALESCE(total_transactions, 0) > 0
      THEN ROUND((COALESCE(successful_transactions, 0)::NUMERIC / total_transactions * 100), 2)
      ELSE 0
    END
  ) INTO v_stats
  FROM payment_stats;

  RETURN v_stats;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_payment_transaction(UUID, NUMERIC, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION process_refund(UUID, NUMERIC, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_payment_statistics(UUID, DATE, DATE) TO authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_invoice_id ON payment_transactions(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_moyasar_id ON payment_transactions(moyasar_payment_id) WHERE moyasar_payment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payment_refunds_transaction_id ON payment_refunds(payment_transaction_id, created_at DESC);

-- Add comments
COMMENT ON TABLE payment_methods IS
'Stored payment methods for users (tokenized cards). Part of PRD Section 5.4.';

COMMENT ON TABLE payment_transactions IS
'All payment transactions processed through Moyasar. Complete audit trail with status tracking.';

COMMENT ON TABLE payment_refunds IS
'Refund records for completed transactions. Supports full and partial refunds.';

COMMENT ON TABLE payment_settings IS
'Global payment gateway configuration. Admin-only access. Contains Moyasar API credentials.';

COMMENT ON FUNCTION create_payment_transaction IS
'Creates a new payment transaction for an invoice. Validates amount limits and user ownership.';

COMMENT ON FUNCTION process_refund IS
'Processes a refund for a completed transaction. Admin-only. Supports partial refunds.';

COMMENT ON FUNCTION get_payment_statistics IS
'Returns payment statistics for a user or globally (admin only). Includes success rates and amounts.';
