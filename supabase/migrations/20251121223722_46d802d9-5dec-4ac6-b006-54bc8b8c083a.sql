-- Create payment_settings table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  is_test_mode BOOLEAN NOT NULL DEFAULT true,
  api_key_test TEXT,
  api_key_live TEXT,
  publishable_key_test TEXT,
  publishable_key_live TEXT,
  supported_payment_methods TEXT[] DEFAULT ARRAY['creditcard'],
  webhook_secret TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider)
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'SAR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_type TEXT,
  moyasar_payment_id TEXT,
  moyasar_status TEXT,
  card_brand TEXT,
  card_last_four TEXT,
  failure_reason TEXT,
  processed_at TIMESTAMPTZ,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit_of_measure TEXT NOT NULL,
  current_stock NUMERIC NOT NULL DEFAULT 0,
  min_stock_level NUMERIC NOT NULL DEFAULT 0,
  max_stock_level NUMERIC,
  unit_cost NUMERIC,
  unit_price NUMERIC,
  reorder_point NUMERIC,
  supplier_name TEXT,
  last_restock_date TIMESTAMPTZ,
  location TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, sku)
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_settings
CREATE POLICY "Admins can manage payment settings"
  ON payment_settings
  FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view enabled payment settings"
  ON payment_settings
  FOR SELECT
  USING (is_enabled = true);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own payment transactions"
  ON payment_transactions
  FOR SELECT
  USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert payment transactions"
  ON payment_transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment transactions"
  ON payment_transactions
  FOR UPDATE
  USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin');

-- RLS Policies for inventory_items
CREATE POLICY "Vendors can manage own inventory"
  ON inventory_items
  FOR ALL
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Admins can manage all inventory"
  ON inventory_items
  FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Create function to create payment transaction
CREATE OR REPLACE FUNCTION create_payment_transaction(
  p_invoice_id UUID,
  p_amount NUMERIC,
  p_description TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_transaction_id UUID;
  v_user_id UUID;
BEGIN
  -- Get current user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized'
    );
  END IF;

  -- Create transaction
  INSERT INTO payment_transactions (
    user_id,
    invoice_id,
    amount,
    description,
    status
  ) VALUES (
    v_user_id,
    p_invoice_id,
    p_amount,
    p_description,
    'pending'
  )
  RETURNING id INTO v_transaction_id;

  RETURN json_build_object(
    'success', true,
    'transaction_id', v_transaction_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Create function to get inventory summary
CREATE OR REPLACE FUNCTION get_inventory_summary(
  p_vendor_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vendor_id UUID;
  v_total_items INT;
  v_low_stock_items INT;
  v_out_of_stock_items INT;
  v_total_value NUMERIC;
BEGIN
  -- Get vendor ID (use parameter or current user)
  v_vendor_id := COALESCE(p_vendor_id, auth.uid());
  
  IF v_vendor_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized'
    );
  END IF;

  -- Calculate summary metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE current_stock <= min_stock_level AND current_stock > 0),
    COUNT(*) FILTER (WHERE current_stock = 0),
    COALESCE(SUM(current_stock * unit_cost), 0)
  INTO 
    v_total_items,
    v_low_stock_items,
    v_out_of_stock_items,
    v_total_value
  FROM inventory_items
  WHERE vendor_id = v_vendor_id
    AND status = 'active';

  RETURN json_build_object(
    'success', true,
    'total_items', v_total_items,
    'low_stock_items', v_low_stock_items,
    'out_of_stock_items', v_out_of_stock_items,
    'total_inventory_value', v_total_value
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_invoice_id ON payment_transactions(invoice_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_inventory_items_vendor_id ON inventory_items(vendor_id);
CREATE INDEX idx_inventory_items_sku ON inventory_items(vendor_id, sku);
CREATE INDEX idx_inventory_items_status ON inventory_items(status);

-- Add updated_at triggers
CREATE TRIGGER update_payment_settings_updated_at
  BEFORE UPDATE ON payment_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();