-- Create table for client budget settings
-- PRD Section 4.1: Spend Management & Budgeting Tools

CREATE TABLE IF NOT EXISTS client_budget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  monthly_budget NUMERIC(12, 2) DEFAULT 0,
  quarterly_budget NUMERIC(12, 2) DEFAULT 0,
  alert_threshold_80 BOOLEAN DEFAULT true,
  alert_threshold_100 BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_budget_settings_client_id
ON client_budget_settings(client_id);

-- Add RLS policies
ALTER TABLE client_budget_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view their own budget settings"
ON client_budget_settings FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Clients can insert their own budget settings"
ON client_budget_settings FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update their own budget settings"
ON client_budget_settings FOR UPDATE
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all budget settings"
ON client_budget_settings FOR SELECT
USING (is_admin());

-- Function to get client spending by period
CREATE OR REPLACE FUNCTION get_client_spending_by_period(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  period TEXT,
  total_spent NUMERIC,
  order_count INTEGER,
  avg_order_value NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_date_trunc TEXT;
BEGIN
  -- Determine date truncation and start date based on timeframe
  CASE p_timeframe
    WHEN 'month' THEN
      v_date_trunc := 'month';
      v_start_date := DATE_TRUNC('month', NOW()) - INTERVAL '11 months';
    WHEN 'quarter' THEN
      v_date_trunc := 'quarter';
      v_start_date := DATE_TRUNC('quarter', NOW()) - INTERVAL '3 quarters';
    WHEN 'year' THEN
      v_date_trunc := 'year';
      v_start_date := DATE_TRUNC('year', NOW()) - INTERVAL '4 years';
    ELSE
      v_date_trunc := 'month';
      v_start_date := DATE_TRUNC('month', NOW()) - INTERVAL '11 months';
  END CASE;

  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC(v_date_trunc, o.created_at), 'YYYY-MM') AS period,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COUNT(*)::INTEGER AS order_count,
    COALESCE(AVG(o.total_amount), 0) AS avg_order_value
  FROM orders o
  WHERE o.client_id = p_client_id
    AND o.status IN ('completed', 'delivered')
    AND o.created_at >= v_start_date
  GROUP BY DATE_TRUNC(v_date_trunc, o.created_at)
  ORDER BY DATE_TRUNC(v_date_trunc, o.created_at) ASC;
END;
$$;

-- Function to get client spending by vendor
CREATE OR REPLACE FUNCTION get_client_spending_by_vendor(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  vendor_id UUID,
  vendor_name TEXT,
  total_spent NUMERIC,
  order_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Determine start date based on timeframe
  CASE p_timeframe
    WHEN 'month' THEN
      v_start_date := DATE_TRUNC('month', NOW());
    WHEN 'quarter' THEN
      v_start_date := DATE_TRUNC('quarter', NOW());
    WHEN 'year' THEN
      v_start_date := DATE_TRUNC('year', NOW());
    ELSE
      v_start_date := DATE_TRUNC('month', NOW());
  END CASE;

  RETURN QUERY
  SELECT
    o.vendor_id,
    COALESCE(vp.company_name, vp.full_name, 'Unknown Vendor') AS vendor_name,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    COUNT(*)::INTEGER AS order_count
  FROM orders o
  LEFT JOIN user_profiles vp ON o.vendor_id = vp.id
  WHERE o.client_id = p_client_id
    AND o.status IN ('completed', 'delivered')
    AND o.created_at >= v_start_date
  GROUP BY o.vendor_id, vp.company_name, vp.full_name
  ORDER BY total_spent DESC;
END;
$$;

-- Function to get client spending by category
CREATE OR REPLACE FUNCTION get_client_spending_by_category(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  category TEXT,
  total_spent NUMERIC,
  percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_start_date TIMESTAMP WITH TIME ZONE;
  v_total_spending NUMERIC;
BEGIN
  -- Determine start date based on timeframe
  CASE p_timeframe
    WHEN 'month' THEN
      v_start_date := DATE_TRUNC('month', NOW());
    WHEN 'quarter' THEN
      v_start_date := DATE_TRUNC('quarter', NOW());
    WHEN 'year' THEN
      v_start_date := DATE_TRUNC('year', NOW());
    ELSE
      v_start_date := DATE_TRUNC('month', NOW());
  END CASE;

  -- Calculate total spending
  SELECT COALESCE(SUM(o.total_amount), 0)
  INTO v_total_spending
  FROM orders o
  WHERE o.client_id = p_client_id
    AND o.status IN ('completed', 'delivered')
    AND o.created_at >= v_start_date;

  IF v_total_spending = 0 THEN
    v_total_spending := 1; -- Prevent division by zero
  END IF;

  RETURN QUERY
  SELECT
    COALESCE(r.category, 'Uncategorized') AS category,
    COALESCE(SUM(o.total_amount), 0) AS total_spent,
    ROUND((COALESCE(SUM(o.total_amount), 0) / v_total_spending * 100), 2) AS percentage
  FROM orders o
  LEFT JOIN requests r ON o.request_id = r.id
  WHERE o.client_id = p_client_id
    AND o.status IN ('completed', 'delivered')
    AND o.created_at >= v_start_date
  GROUP BY r.category
  ORDER BY total_spent DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_client_spending_by_period(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_client_spending_by_vendor(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_client_spending_by_category(UUID, TEXT) TO authenticated;

-- Add comments
COMMENT ON TABLE client_budget_settings IS
'Stores budget settings and thresholds for clients. Part of PRD Section 4.1 Spend Management & Budgeting Tools.';

COMMENT ON FUNCTION get_client_spending_by_period IS
'Returns client spending aggregated by time period (month/quarter/year). Used for spending trends visualization.';

COMMENT ON FUNCTION get_client_spending_by_vendor IS
'Returns client spending grouped by vendor. Used for supplier spending analysis.';

COMMENT ON FUNCTION get_client_spending_by_category IS
'Returns client spending grouped by category with percentages. Used for category spending breakdown.';

-- Create function to check budget thresholds and send alerts
CREATE OR REPLACE FUNCTION check_budget_alerts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r RECORD;
  v_monthly_spending NUMERIC;
  v_quarterly_spending NUMERIC;
  v_monthly_percentage NUMERIC;
  v_quarterly_percentage NUMERIC;
BEGIN
  -- Loop through all clients with budget settings
  FOR r IN
    SELECT
      bs.*,
      up.email,
      up.full_name
    FROM client_budget_settings bs
    JOIN user_profiles up ON bs.client_id = up.id
    WHERE bs.monthly_budget > 0 OR bs.quarterly_budget > 0
  LOOP
    -- Calculate current monthly spending
    SELECT COALESCE(SUM(o.total_amount), 0)
    INTO v_monthly_spending
    FROM orders o
    WHERE o.client_id = r.client_id
      AND o.status IN ('completed', 'delivered')
      AND o.created_at >= DATE_TRUNC('month', NOW());

    -- Calculate current quarterly spending
    SELECT COALESCE(SUM(o.total_amount), 0)
    INTO v_quarterly_spending
    FROM orders o
    WHERE o.client_id = r.client_id
      AND o.status IN ('completed', 'delivered')
      AND o.created_at >= DATE_TRUNC('quarter', NOW());

    -- Check monthly budget
    IF r.monthly_budget > 0 THEN
      v_monthly_percentage := (v_monthly_spending / r.monthly_budget * 100);

      -- Alert at 100%
      IF v_monthly_percentage >= 100 AND r.alert_threshold_100 THEN
        INSERT INTO notifications (user_id, title, message, type, priority)
        VALUES (
          r.client_id,
          'Budget Exceeded - Monthly',
          'You have exceeded your monthly budget of ' || r.monthly_budget || ' SAR. Current spending: ' || v_monthly_spending || ' SAR.',
          'budget_alert',
          'high'
        );
      -- Alert at 80%
      ELSIF v_monthly_percentage >= 80 AND r.alert_threshold_80 THEN
        INSERT INTO notifications (user_id, title, message, type, priority)
        VALUES (
          r.client_id,
          'Budget Warning - Monthly',
          'You have used ' || ROUND(v_monthly_percentage, 1) || '% of your monthly budget. Current spending: ' || v_monthly_spending || ' SAR of ' || r.monthly_budget || ' SAR.',
          'budget_alert',
          'medium'
        );
      END IF;
    END IF;

    -- Check quarterly budget
    IF r.quarterly_budget > 0 THEN
      v_quarterly_percentage := (v_quarterly_spending / r.quarterly_budget * 100);

      -- Alert at 100%
      IF v_quarterly_percentage >= 100 AND r.alert_threshold_100 THEN
        INSERT INTO notifications (user_id, title, message, type, priority)
        VALUES (
          r.client_id,
          'Budget Exceeded - Quarterly',
          'You have exceeded your quarterly budget of ' || r.quarterly_budget || ' SAR. Current spending: ' || v_quarterly_spending || ' SAR.',
          'budget_alert',
          'high'
        );
      -- Alert at 80%
      ELSIF v_quarterly_percentage >= 80 AND r.alert_threshold_80 THEN
        INSERT INTO notifications (user_id, title, message, type, priority)
        VALUES (
          r.client_id,
          'Budget Warning - Quarterly',
          'You have used ' || ROUND(v_quarterly_percentage, 1) || '% of your quarterly budget. Current spending: ' || v_quarterly_spending || ' SAR of ' || r.quarterly_budget || ' SAR.',
          'budget_alert',
          'medium'
        );
      END IF;
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION check_budget_alerts() TO authenticated;

COMMENT ON FUNCTION check_budget_alerts IS
'Checks all client budgets and creates notifications when spending reaches 80% or 100% of set thresholds. Should be run periodically via cron job.';
