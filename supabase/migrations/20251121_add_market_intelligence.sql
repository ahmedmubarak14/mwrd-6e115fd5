-- Create market intelligence functions for suppliers
-- PRD Section 4.2: Market Intelligence Reports
-- Provides anonymized, aggregated market data to help suppliers price competitively

-- Function to get demand trends for a vendor's categories
CREATE OR REPLACE FUNCTION get_vendor_demand_trends(
  p_vendor_id UUID,
  p_months INTEGER DEFAULT 6
)
RETURNS TABLE (
  month TEXT,
  rfq_count INTEGER,
  avg_budget NUMERIC,
  category TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_categories TEXT[];
BEGIN
  -- Get vendor's primary categories
  SELECT COALESCE(categories, ARRAY[]::TEXT[])
  INTO v_vendor_categories
  FROM user_profiles
  WHERE id = p_vendor_id;

  -- Return demand trends for these categories
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', r.created_at), 'YYYY-MM') as month,
    COUNT(*)::INTEGER as rfq_count,
    AVG(r.budget) as avg_budget,
    r.category
  FROM requests r
  WHERE r.status IN ('open', 'closed', 'awarded')
    AND r.created_at >= NOW() - (p_months || ' months')::INTERVAL
    AND (
      r.category = ANY(v_vendor_categories)
      OR EXISTS (
        SELECT 1 FROM unnest(v_vendor_categories) as vc
        WHERE r.category ILIKE '%' || vc || '%'
      )
    )
  GROUP BY DATE_TRUNC('month', r.created_at), r.category
  ORDER BY DATE_TRUNC('month', r.created_at) DESC, r.category;
END;
$$;

-- Function to get pricing bands for winning bids in vendor's categories
CREATE OR REPLACE FUNCTION get_pricing_bands(
  p_vendor_id UUID,
  p_months INTEGER DEFAULT 3
)
RETURNS TABLE (
  category TEXT,
  price_range TEXT,
  bid_count INTEGER,
  min_price NUMERIC,
  max_price NUMERIC,
  avg_price NUMERIC,
  median_price NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_categories TEXT[];
BEGIN
  -- Get vendor's primary categories
  SELECT COALESCE(categories, ARRAY[]::TEXT[])
  INTO v_vendor_categories
  FROM user_profiles
  WHERE id = p_vendor_id;

  -- Return pricing statistics for winning bids
  RETURN QUERY
  WITH winning_offers AS (
    SELECT
      o.price,
      r.category,
      r.budget
    FROM offers o
    JOIN requests r ON o.request_id = r.id
    WHERE o.client_approval_status = 'approved'
      AND o.created_at >= NOW() - (p_months || ' months')::INTERVAL
      AND (
        r.category = ANY(v_vendor_categories)
        OR EXISTS (
          SELECT 1 FROM unnest(v_vendor_categories) as vc
          WHERE r.category ILIKE '%' || vc || '%'
        )
      )
  ),
  price_stats AS (
    SELECT
      category,
      MIN(price) as min_price,
      MAX(price) as max_price,
      AVG(price) as avg_price,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price,
      COUNT(*) as bid_count
    FROM winning_offers
    WHERE price > 0
    GROUP BY category
  )
  SELECT
    ps.category,
    CASE
      WHEN ps.min_price = ps.max_price THEN ps.min_price::TEXT || ' SAR'
      ELSE ps.min_price::TEXT || ' - ' || ps.max_price::TEXT || ' SAR'
    END as price_range,
    ps.bid_count::INTEGER,
    ps.min_price,
    ps.max_price,
    ROUND(ps.avg_price, 2) as avg_price,
    ROUND(ps.median_price, 2) as median_price
  FROM price_stats ps
  WHERE ps.bid_count >= 3  -- Only show if there are at least 3 bids for anonymity
  ORDER BY ps.category;
END;
$$;

-- Function to get frequently requested specifications/requirements
CREATE OR REPLACE FUNCTION get_popular_specifications(
  p_vendor_id UUID,
  p_months INTEGER DEFAULT 3
)
RETURNS TABLE (
  category TEXT,
  keyword TEXT,
  frequency INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_categories TEXT[];
BEGIN
  -- Get vendor's primary categories
  SELECT COALESCE(categories, ARRAY[]::TEXT[])
  INTO v_vendor_categories
  FROM user_profiles
  WHERE id = p_vendor_id;

  -- Return popular keywords from RFQ descriptions and titles
  -- This is a simplified version - in production, you'd use full-text search or NLP
  RETURN QUERY
  WITH relevant_requests AS (
    SELECT
      r.category,
      LOWER(r.title || ' ' || COALESCE(r.description, '')) as text_content
    FROM requests r
    WHERE r.status IN ('open', 'closed', 'awarded')
      AND r.created_at >= NOW() - (p_months || ' months')::INTERVAL
      AND (
        r.category = ANY(v_vendor_categories)
        OR EXISTS (
          SELECT 1 FROM unnest(v_vendor_categories) as vc
          WHERE r.category ILIKE '%' || vc || '%'
        )
      )
  ),
  -- Extract common keywords (this is a simple approach)
  word_frequency AS (
    SELECT
      category,
      regexp_split_to_table(text_content, E'\\s+') as word
    FROM relevant_requests
  ),
  filtered_words AS (
    SELECT
      category,
      word
    FROM word_frequency
    WHERE LENGTH(word) > 4  -- Filter out short words
      AND word NOT IN ('the', 'and', 'for', 'with', 'from', 'that', 'this', 'have', 'will', 'would', 'should', 'could')
  )
  SELECT
    fw.category,
    fw.word as keyword,
    COUNT(*)::INTEGER as frequency
  FROM filtered_words fw
  GROUP BY fw.category, fw.word
  HAVING COUNT(*) >= 3  -- Must appear at least 3 times
  ORDER BY fw.category, COUNT(*) DESC
  LIMIT 50;
END;
$$;

-- Function to get market competition insights
CREATE OR REPLACE FUNCTION get_competition_insights(
  p_vendor_id UUID,
  p_months INTEGER DEFAULT 3
)
RETURNS TABLE (
  category TEXT,
  avg_offers_per_rfq NUMERIC,
  avg_response_time_hours NUMERIC,
  win_rate_benchmark NUMERIC,
  total_rfqs INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_categories TEXT[];
BEGIN
  -- Get vendor's primary categories
  SELECT COALESCE(categories, ARRAY[]::TEXT[])
  INTO v_vendor_categories
  FROM user_profiles
  WHERE id = p_vendor_id;

  -- Return competition metrics
  RETURN QUERY
  WITH relevant_rfqs AS (
    SELECT
      r.id as request_id,
      r.category,
      r.created_at
    FROM requests r
    WHERE r.status IN ('open', 'closed', 'awarded')
      AND r.created_at >= NOW() - (p_months || ' months')::INTERVAL
      AND (
        r.category = ANY(v_vendor_categories)
        OR EXISTS (
          SELECT 1 FROM unnest(v_vendor_categories) as vc
          WHERE r.category ILIKE '%' || vc || '%'
        )
      )
  ),
  offer_stats AS (
    SELECT
      rr.category,
      rr.request_id,
      COUNT(o.id) as offer_count,
      AVG(EXTRACT(EPOCH FROM (o.created_at - rr.created_at)) / 3600) as avg_response_hours,
      COUNT(CASE WHEN o.client_approval_status = 'approved' THEN 1 END) as approved_count
    FROM relevant_rfqs rr
    LEFT JOIN offers o ON rr.request_id = o.request_id
    WHERE o.id IS NOT NULL
    GROUP BY rr.category, rr.request_id
  )
  SELECT
    os.category,
    ROUND(AVG(os.offer_count), 2) as avg_offers_per_rfq,
    ROUND(AVG(os.avg_response_hours), 2) as avg_response_time_hours,
    ROUND((SUM(os.approved_count)::NUMERIC / NULLIF(SUM(os.offer_count), 0) * 100), 2) as win_rate_benchmark,
    COUNT(DISTINCT os.request_id)::INTEGER as total_rfqs
  FROM offer_stats os
  GROUP BY os.category
  HAVING COUNT(DISTINCT os.request_id) >= 5  -- Need at least 5 RFQs for meaningful stats
  ORDER BY os.category;
END;
$$;

-- Function to get vendor's market position (comparative analysis)
CREATE OR REPLACE FUNCTION get_vendor_market_position(
  p_vendor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_vendor_stats RECORD;
  v_market_stats RECORD;
  v_result JSONB;
BEGIN
  -- Get vendor's own statistics
  SELECT
    COUNT(DISTINCT o.request_id) as total_offers_submitted,
    AVG(EXTRACT(EPOCH FROM (o.created_at - r.created_at)) / 3600) as avg_response_time,
    COUNT(CASE WHEN o.client_approval_status = 'approved' THEN 1 END) as wins,
    AVG(o.price) as avg_offer_price
  INTO v_vendor_stats
  FROM offers o
  JOIN requests r ON o.request_id = r.id
  WHERE o.vendor_id = p_vendor_id
    AND o.created_at >= NOW() - INTERVAL '3 months';

  -- Get market averages (anonymized)
  SELECT
    AVG(offer_count) as avg_offers_per_vendor,
    AVG(avg_response_hours) as market_avg_response_time,
    AVG(win_rate) as market_avg_win_rate
  INTO v_market_stats
  FROM (
    SELECT
      o.vendor_id,
      COUNT(*) as offer_count,
      AVG(EXTRACT(EPOCH FROM (o.created_at - r.created_at)) / 3600) as avg_response_hours,
      (COUNT(CASE WHEN o.client_approval_status = 'approved' THEN 1 END)::NUMERIC /
       NULLIF(COUNT(*), 0) * 100) as win_rate
    FROM offers o
    JOIN requests r ON o.request_id = r.id
    WHERE o.created_at >= NOW() - INTERVAL '3 months'
      AND o.vendor_id != p_vendor_id  -- Exclude the requesting vendor
    GROUP BY o.vendor_id
    HAVING COUNT(*) >= 5  -- Only consider active vendors
  ) vendor_stats;

  -- Build result JSON
  v_result := jsonb_build_object(
    'your_stats', jsonb_build_object(
      'offers_submitted', v_vendor_stats.total_offers_submitted,
      'avg_response_time_hours', ROUND(v_vendor_stats.avg_response_time, 2),
      'win_count', v_vendor_stats.wins,
      'win_rate', CASE
        WHEN v_vendor_stats.total_offers_submitted > 0
        THEN ROUND((v_vendor_stats.wins::NUMERIC / v_vendor_stats.total_offers_submitted * 100), 2)
        ELSE 0
      END
    ),
    'market_benchmarks', jsonb_build_object(
      'avg_offers_per_vendor', ROUND(v_market_stats.avg_offers_per_vendor, 2),
      'avg_response_time_hours', ROUND(v_market_stats.market_avg_response_time, 2),
      'avg_win_rate', ROUND(v_market_stats.market_avg_win_rate, 2)
    ),
    'performance_vs_market', jsonb_build_object(
      'response_time', CASE
        WHEN v_vendor_stats.avg_response_time < v_market_stats.market_avg_response_time THEN 'better'
        WHEN v_vendor_stats.avg_response_time > v_market_stats.market_avg_response_time THEN 'below'
        ELSE 'average'
      END,
      'activity', CASE
        WHEN v_vendor_stats.total_offers_submitted > v_market_stats.avg_offers_per_vendor THEN 'above_average'
        WHEN v_vendor_stats.total_offers_submitted < v_market_stats.avg_offers_per_vendor THEN 'below_average'
        ELSE 'average'
      END
    )
  );

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_vendor_demand_trends(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_pricing_bands(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_popular_specifications(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_competition_insights(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_vendor_market_position(UUID) TO authenticated;

-- Add comments
COMMENT ON FUNCTION get_vendor_demand_trends IS
'Returns anonymized demand trends for categories relevant to the vendor. Shows RFQ volume and budgets over time. Part of PRD Section 4.2 Market Intelligence Reports.';

COMMENT ON FUNCTION get_pricing_bands IS
'Returns anonymized pricing statistics for winning bids in vendor categories. Helps vendors price competitively. Data is only shown when there are at least 3 bids to ensure anonymity.';

COMMENT ON FUNCTION get_popular_specifications IS
'Returns frequently requested keywords and specifications from RFQs in vendor categories. Helps vendors understand market demands.';

COMMENT ON FUNCTION get_competition_insights IS
'Returns market competition metrics like average offers per RFQ and response times. Strictly anonymized - no individual competitor data.';

COMMENT ON FUNCTION get_vendor_market_position IS
'Returns comparative analysis of vendor performance vs. market benchmarks. All market data is anonymized and aggregated.';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_requests_category_status_created
  ON requests(category, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_offers_vendor_created
  ON offers(vendor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_offers_request_status
  ON offers(request_id, client_approval_status);
