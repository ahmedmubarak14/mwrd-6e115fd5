-- Create basic inventory tracking system for suppliers
-- PRD Section 4.2: SaaS-lite Toolkit for Suppliers
-- Simple inventory management for suppliers without their own systems

-- Inventory items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit_of_measure TEXT DEFAULT 'unit',
  current_stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 10,
  max_stock_level INTEGER,
  unit_cost NUMERIC(12, 2),
  unit_price NUMERIC(12, 2),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_id, sku)
);

-- Inventory movements table (stock in/out tracking)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT,
  reference_type TEXT, -- 'order', 'return', 'damage', 'purchase', 'manual'
  reference_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Low stock alerts (automatically triggered)
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for inventory_items
CREATE POLICY "Vendors can view own inventory items"
  ON inventory_items
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert own inventory items"
  ON inventory_items
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update own inventory items"
  ON inventory_items
  FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete own inventory items"
  ON inventory_items
  FOR DELETE
  USING (auth.uid() = vendor_id);

-- Policies for inventory_movements
CREATE POLICY "Vendors can view own inventory movements"
  ON inventory_movements
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can insert own inventory movements"
  ON inventory_movements
  FOR INSERT
  WITH CHECK (auth.uid() = vendor_id);

-- Policies for inventory_alerts
CREATE POLICY "Vendors can view own inventory alerts"
  ON inventory_alerts
  FOR SELECT
  USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update own inventory alerts"
  ON inventory_alerts
  FOR UPDATE
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete own inventory alerts"
  ON inventory_alerts
  FOR DELETE
  USING (auth.uid() = vendor_id);

-- Function to record inventory movement and update stock
CREATE OR REPLACE FUNCTION record_inventory_movement(
  p_inventory_item_id UUID,
  p_movement_type TEXT,
  p_quantity INTEGER,
  p_reason TEXT DEFAULT NULL,
  p_reference_type TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_id UUID;
  v_current_stock INTEGER;
  v_new_stock INTEGER;
  v_min_stock INTEGER;
  v_max_stock INTEGER;
  v_item_name TEXT;
  v_movement_id UUID;
BEGIN
  -- Get current stock and vendor
  SELECT current_stock, vendor_id, min_stock_level, max_stock_level, name
  INTO v_current_stock, v_vendor_id, v_min_stock, v_max_stock, v_item_name
  FROM inventory_items
  WHERE id = p_inventory_item_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Inventory item not found');
  END IF;

  -- Verify ownership
  IF auth.uid() != v_vendor_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Calculate new stock
  CASE p_movement_type
    WHEN 'in' THEN
      v_new_stock := v_current_stock + p_quantity;
    WHEN 'out' THEN
      IF p_quantity > v_current_stock THEN
        RETURN jsonb_build_object('success', false, 'error', 'Insufficient stock');
      END IF;
      v_new_stock := v_current_stock - p_quantity;
    WHEN 'adjustment' THEN
      v_new_stock := p_quantity; -- Direct adjustment to specific value
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Invalid movement type');
  END CASE;

  -- Insert movement record
  INSERT INTO inventory_movements (
    inventory_item_id,
    vendor_id,
    movement_type,
    quantity,
    previous_stock,
    new_stock,
    reason,
    reference_type,
    reference_id,
    notes,
    created_by
  ) VALUES (
    p_inventory_item_id,
    v_vendor_id,
    p_movement_type,
    p_quantity,
    v_current_stock,
    v_new_stock,
    p_reason,
    p_reference_type,
    p_reference_id,
    p_notes,
    auth.uid()
  ) RETURNING id INTO v_movement_id;

  -- Update inventory item stock
  UPDATE inventory_items
  SET current_stock = v_new_stock,
      updated_at = NOW()
  WHERE id = p_inventory_item_id;

  -- Check for alerts
  -- Low stock alert
  IF v_new_stock <= v_min_stock AND v_new_stock > 0 THEN
    INSERT INTO inventory_alerts (vendor_id, inventory_item_id, alert_type, message)
    VALUES (
      v_vendor_id,
      p_inventory_item_id,
      'low_stock',
      format('Low stock alert: %s is at %s units (minimum: %s)', v_item_name, v_new_stock, v_min_stock)
    );
  END IF;

  -- Out of stock alert
  IF v_new_stock = 0 THEN
    INSERT INTO inventory_alerts (vendor_id, inventory_item_id, alert_type, message)
    VALUES (
      v_vendor_id,
      p_inventory_item_id,
      'out_of_stock',
      format('Out of stock: %s has 0 units remaining', v_item_name)
    );
  END IF;

  -- Overstock alert (if max is set)
  IF v_max_stock IS NOT NULL AND v_new_stock > v_max_stock THEN
    INSERT INTO inventory_alerts (vendor_id, inventory_item_id, alert_type, message)
    VALUES (
      v_vendor_id,
      p_inventory_item_id,
      'overstock',
      format('Overstock alert: %s is at %s units (maximum: %s)', v_item_name, v_new_stock, v_max_stock)
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'movement_id', v_movement_id,
    'previous_stock', v_current_stock,
    'new_stock', v_new_stock
  );
END;
$$;

-- Function to get inventory summary for vendor
CREATE OR REPLACE FUNCTION get_inventory_summary(p_vendor_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_total_items INTEGER;
  v_low_stock_items INTEGER;
  v_out_of_stock_items INTEGER;
  v_total_value NUMERIC;
BEGIN
  -- Verify ownership
  IF auth.uid() != p_vendor_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Get counts
  SELECT
    COUNT(*),
    COUNT(*) FILTER (WHERE current_stock <= min_stock_level AND current_stock > 0),
    COUNT(*) FILTER (WHERE current_stock = 0),
    SUM(current_stock * COALESCE(unit_cost, 0))
  INTO v_total_items, v_low_stock_items, v_out_of_stock_items, v_total_value
  FROM inventory_items
  WHERE vendor_id = p_vendor_id;

  v_result := jsonb_build_object(
    'success', true,
    'total_items', COALESCE(v_total_items, 0),
    'low_stock_items', COALESCE(v_low_stock_items, 0),
    'out_of_stock_items', COALESCE(v_out_of_stock_items, 0),
    'total_inventory_value', COALESCE(v_total_value, 0)
  );

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION record_inventory_movement(UUID, TEXT, INTEGER, TEXT, TEXT, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_inventory_summary(UUID) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_vendor_id ON inventory_items(vendor_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_low_stock ON inventory_items(vendor_id, current_stock) WHERE current_stock <= min_stock_level;
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item_id ON inventory_movements(inventory_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_vendor_id ON inventory_movements(vendor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_vendor_id ON inventory_alerts(vendor_id, is_read, created_at DESC);

-- Add comments
COMMENT ON TABLE inventory_items IS
'Basic inventory items for suppliers. Part of PRD Section 4.2 SaaS-lite Toolkit.';

COMMENT ON TABLE inventory_movements IS
'Tracks all inventory movements (in/out/adjustments) for audit trail and reporting.';

COMMENT ON TABLE inventory_alerts IS
'Automated alerts for low stock, out of stock, and overstock situations.';

COMMENT ON FUNCTION record_inventory_movement IS
'Records an inventory movement and automatically updates stock levels and generates alerts.';

COMMENT ON FUNCTION get_inventory_summary IS
'Returns summary statistics about vendor inventory (total items, low stock count, total value).';
