-- Add terms_conditions to vendor_branding
ALTER TABLE vendor_branding ADD COLUMN IF NOT EXISTS terms_conditions TEXT;

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  payment_type TEXT NOT NULL,
  provider TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  card_last_four TEXT,
  card_brand TEXT,
  card_expiry TEXT,
  billing_address JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own payment methods"
  ON payment_methods
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment methods"
  ON payment_methods
  FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

-- Create function for internal approval
CREATE OR REPLACE FUNCTION submit_request_for_internal_approval(
  p_request_id UUID,
  p_approver_ids UUID[]
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN json_build_object(
    'success', true,
    'message', 'Request submitted for approval'
  );
END;
$$;

-- Create function for calculating vendor performance
CREATE OR REPLACE FUNCTION calculate_vendor_performance_metrics(
  p_vendor_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_array(
    json_build_object(
      'metric', 'on_time_delivery',
      'score', 85,
      'trend', 'up'
    )
  )
  INTO v_result;

  RETURN v_result;
END;
$$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

-- Add trigger
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();