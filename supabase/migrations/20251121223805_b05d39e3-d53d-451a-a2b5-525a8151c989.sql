-- Create inventory_alerts table
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  inventory_item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Create inventory_movements table
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  previous_stock NUMERIC NOT NULL,
  new_stock NUMERIC NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  notes TEXT,
  performed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_alerts
CREATE POLICY "Vendors can view own alerts"
  ON inventory_alerts
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update own alerts"
  ON inventory_alerts
  FOR UPDATE
  USING (auth.uid() = vendor_id);

CREATE POLICY "Admins can manage all alerts"
  ON inventory_alerts
  FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for inventory_movements
CREATE POLICY "Vendors can view own movements"
  ON inventory_movements
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert own movements"
  ON inventory_movements
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Admins can manage all movements"
  ON inventory_movements
  FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Create function to record inventory movement
CREATE OR REPLACE FUNCTION record_inventory_movement(
  p_inventory_item_id UUID,
  p_movement_type TEXT,
  p_quantity NUMERIC,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vendor_id UUID;
  v_previous_stock NUMERIC;
  v_new_stock NUMERIC;
  v_movement_id UUID;
BEGIN
  -- Get current user
  v_vendor_id := auth.uid();
  
  IF v_vendor_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized'
    );
  END IF;

  -- Get current stock
  SELECT current_stock INTO v_previous_stock
  FROM inventory_items
  WHERE id = p_inventory_item_id AND vendor_id = v_vendor_id;

  IF v_previous_stock IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Inventory item not found'
    );
  END IF;

  -- Calculate new stock
  IF p_movement_type IN ('purchase', 'adjustment_increase', 'return') THEN
    v_new_stock := v_previous_stock + p_quantity;
  ELSE
    v_new_stock := v_previous_stock - p_quantity;
  END IF;

  -- Update inventory item
  UPDATE inventory_items
  SET current_stock = v_new_stock,
      updated_at = now()
  WHERE id = p_inventory_item_id;

  -- Record movement
  INSERT INTO inventory_movements (
    vendor_id,
    inventory_item_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    notes,
    performed_by
  ) VALUES (
    v_vendor_id,
    p_inventory_item_id,
    p_movement_type,
    p_quantity,
    v_previous_stock,
    v_new_stock,
    p_notes,
    v_vendor_id
  )
  RETURNING id INTO v_movement_id;

  RETURN json_build_object(
    'success', true,
    'movement_id', v_movement_id,
    'previous_stock', v_previous_stock,
    'new_stock', v_new_stock
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Create market intelligence functions
CREATE OR REPLACE FUNCTION get_vendor_demand_trends(
  p_vendor_id UUID DEFAULT NULL,
  p_category TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_to_json(t))
  INTO v_result
  FROM (
    SELECT 
      category,
      COUNT(*) as request_count,
      DATE_TRUNC('month', created_at) as period
    FROM requests
    WHERE (p_category IS NULL OR category = p_category)
      AND created_at >= NOW() - INTERVAL '6 months'
    GROUP BY category, DATE_TRUNC('month', created_at)
    ORDER BY period DESC
    LIMIT 100
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

CREATE OR REPLACE FUNCTION get_pricing_bands(
  p_category TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'min_price', MIN(price),
    'max_price', MAX(price),
    'avg_price', AVG(price),
    'median_price', PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price)
  )
  INTO v_result
  FROM offers
  WHERE request_id IN (
    SELECT id FROM requests WHERE category = p_category
  )
  AND status = 'accepted'
  AND created_at >= NOW() - INTERVAL '3 months';

  RETURN COALESCE(v_result, '{}'::json);
END;
$$;

CREATE OR REPLACE FUNCTION get_popular_specifications(
  p_category TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_agg(row_to_json(t))
  INTO v_result
  FROM (
    SELECT 
      requirements->'specifications' as specification,
      COUNT(*) as frequency
    FROM requests
    WHERE category = p_category
      AND requirements IS NOT NULL
      AND created_at >= NOW() - INTERVAL '6 months'
    GROUP BY requirements->'specifications'
    ORDER BY frequency DESC
    LIMIT 10
  ) t;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

CREATE OR REPLACE FUNCTION get_competition_insights(
  p_vendor_id UUID,
  p_category TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'total_competitors', COUNT(DISTINCT vendor_id),
    'avg_response_time', AVG(EXTRACT(EPOCH FROM (offers.created_at - requests.created_at))/3600),
    'win_rate', ROUND(COUNT(*) FILTER (WHERE offers.status = 'accepted')::NUMERIC / NULLIF(COUNT(*), 0) * 100, 2)
  )
  INTO v_result
  FROM offers
  JOIN requests ON offers.request_id = requests.id
  WHERE (p_category IS NULL OR requests.category = p_category)
    AND offers.created_at >= NOW() - INTERVAL '3 months';

  RETURN COALESCE(v_result, '{}'::json);
END;
$$;

CREATE OR REPLACE FUNCTION get_vendor_market_position(
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
  WITH vendor_stats AS (
    SELECT
      COUNT(*) as total_offers,
      COUNT(*) FILTER (WHERE status = 'accepted') as accepted_offers,
      AVG(price) as avg_price
    FROM offers
    WHERE vendor_id = p_vendor_id
      AND created_at >= NOW() - INTERVAL '3 months'
  ),
  market_stats AS (
    SELECT
      AVG(price) as market_avg_price,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as market_median_price
    FROM offers
    WHERE created_at >= NOW() - INTERVAL '3 months'
  )
  SELECT json_build_object(
    'total_offers', vs.total_offers,
    'win_rate', ROUND(vs.accepted_offers::NUMERIC / NULLIF(vs.total_offers, 0) * 100, 2),
    'price_position', CASE
      WHEN vs.avg_price < ms.market_median_price THEN 'below_market'
      WHEN vs.avg_price > ms.market_median_price * 1.1 THEN 'above_market'
      ELSE 'at_market'
    END
  )
  INTO v_result
  FROM vendor_stats vs, market_stats ms;

  RETURN COALESCE(v_result, '{}'::json);
END;
$$;

-- Create indexes
CREATE INDEX idx_inventory_alerts_vendor_id ON inventory_alerts(vendor_id);
CREATE INDEX idx_inventory_alerts_is_read ON inventory_alerts(is_read);
CREATE INDEX idx_inventory_movements_vendor_id ON inventory_movements(vendor_id);
CREATE INDEX idx_inventory_movements_item_id ON inventory_movements(inventory_item_id);
CREATE INDEX idx_inventory_movements_created_at ON inventory_movements(created_at);