-- Create function to calculate vendor performance metrics
-- This function calculates objective, platform-verified metrics for supplier scorecards
-- as specified in PRD Section 4.1

CREATE OR REPLACE FUNCTION calculate_vendor_performance_metrics(p_vendor_id UUID)
RETURNS TABLE (
  vendor_id UUID,
  order_completion_rate NUMERIC,
  on_time_delivery_rate NUMERIC,
  avg_quote_response_time_hours NUMERIC,
  repeat_business_rate NUMERIC,
  total_completed_orders INTEGER,
  total_quotes_submitted INTEGER,
  avg_rating NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_orders INTEGER;
  v_completed_orders INTEGER;
  v_on_time_deliveries INTEGER;
  v_total_deliveries INTEGER;
  v_total_quotes INTEGER;
  v_avg_response_time_hours NUMERIC;
  v_unique_clients INTEGER;
  v_repeat_clients INTEGER;
  v_avg_rating NUMERIC;
BEGIN
  -- Calculate total orders for this vendor
  SELECT COUNT(*)
  INTO v_total_orders
  FROM orders
  WHERE vendor_id = p_vendor_id;

  -- Calculate completed orders (status = 'completed')
  SELECT COUNT(*)
  INTO v_completed_orders
  FROM orders
  WHERE vendor_id = p_vendor_id
    AND status = 'completed';

  -- Calculate on-time deliveries
  -- Orders marked as completed on or before the delivery_date
  SELECT COUNT(*)
  INTO v_on_time_deliveries
  FROM orders
  WHERE vendor_id = p_vendor_id
    AND status = 'completed'
    AND completed_at IS NOT NULL
    AND delivery_date IS NOT NULL
    AND completed_at <= delivery_date;

  -- Total deliveries (completed + delivered orders)
  SELECT COUNT(*)
  INTO v_total_deliveries
  FROM orders
  WHERE vendor_id = p_vendor_id
    AND status IN ('completed', 'delivered')
    AND delivery_date IS NOT NULL;

  -- Calculate total quotes submitted
  SELECT COUNT(*)
  INTO v_total_quotes
  FROM offers
  WHERE vendor_id = p_vendor_id;

  -- Calculate average quote response time in hours
  -- Time between request creation and offer submission
  SELECT AVG(
    EXTRACT(EPOCH FROM (offers.created_at - requests.created_at)) / 3600
  )
  INTO v_avg_response_time_hours
  FROM offers
  JOIN requests ON offers.request_id = requests.id
  WHERE offers.vendor_id = p_vendor_id
    AND offers.created_at > requests.created_at;

  -- Calculate repeat business rate
  -- Percentage of clients who have placed more than one order with this vendor
  SELECT COUNT(DISTINCT client_id)
  INTO v_unique_clients
  FROM orders
  WHERE vendor_id = p_vendor_id;

  SELECT COUNT(DISTINCT client_id)
  INTO v_repeat_clients
  FROM (
    SELECT client_id, COUNT(*) as order_count
    FROM orders
    WHERE vendor_id = p_vendor_id
    GROUP BY client_id
    HAVING COUNT(*) > 1
  ) AS repeat_clients_subquery;

  -- Calculate average rating from completed orders
  -- Assuming there's a rating field in orders table
  SELECT AVG(rating)
  INTO v_avg_rating
  FROM orders
  WHERE vendor_id = p_vendor_id
    AND rating IS NOT NULL;

  -- Return the calculated metrics
  RETURN QUERY SELECT
    p_vendor_id,
    CASE
      WHEN v_total_orders > 0 THEN (v_completed_orders::NUMERIC / v_total_orders::NUMERIC * 100)
      ELSE 0
    END AS order_completion_rate,
    CASE
      WHEN v_total_deliveries > 0 THEN (v_on_time_deliveries::NUMERIC / v_total_deliveries::NUMERIC * 100)
      ELSE 0
    END AS on_time_delivery_rate,
    COALESCE(v_avg_response_time_hours, 0) AS avg_quote_response_time_hours,
    CASE
      WHEN v_unique_clients > 0 THEN (v_repeat_clients::NUMERIC / v_unique_clients::NUMERIC * 100)
      ELSE 0
    END AS repeat_business_rate,
    v_completed_orders AS total_completed_orders,
    v_total_quotes AS total_quotes_submitted,
    COALESCE(v_avg_rating, 0) AS avg_rating,
    NOW() AS last_updated;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION calculate_vendor_performance_metrics(UUID) TO authenticated;

-- Add comment explaining the function
COMMENT ON FUNCTION calculate_vendor_performance_metrics IS
'Calculates objective supplier performance metrics for scorecards.
Metrics include: order completion rate, on-time delivery rate, average quote response time,
repeat business rate, and average rating. These metrics are calculated from actual platform
data and cannot be edited by suppliers, ensuring trust and transparency as per PRD Section 4.1.';

-- Add indexes to optimize performance metric calculations
CREATE INDEX IF NOT EXISTS idx_orders_vendor_status ON orders(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_completed ON orders(vendor_id, completed_at) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_offers_vendor_created ON offers(vendor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_client ON orders(vendor_id, client_id);

-- Create a materialized view for faster performance metric lookups
-- This can be refreshed periodically (e.g., daily) to reduce computation
CREATE MATERIALIZED VIEW IF NOT EXISTS vendor_performance_metrics_cache AS
SELECT
  vp.id as vendor_id,
  vp.company_name,
  (SELECT * FROM calculate_vendor_performance_metrics(vp.id)).*
FROM user_profiles vp
WHERE vp.role = 'vendor'
  AND vp.status = 'active';

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_vendor_perf_cache_vendor_id
ON vendor_performance_metrics_cache(vendor_id);

-- Create function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_vendor_performance_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_performance_metrics_cache;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_vendor_performance_cache() TO authenticated;

-- Add comment
COMMENT ON MATERIALIZED VIEW vendor_performance_metrics_cache IS
'Cached vendor performance metrics for faster lookup. Should be refreshed periodically.';

COMMENT ON FUNCTION refresh_vendor_performance_cache IS
'Refreshes the vendor performance metrics cache. Call this periodically (e.g., via a cron job).';
