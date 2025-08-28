-- Fix critical security vulnerabilities

-- 1. Fix vendor_public_info table - Enable RLS and create proper policies
ALTER TABLE vendor_public_info ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved vendors only
CREATE POLICY "Anyone can view approved vendor info" 
ON vendor_public_info 
FOR SELECT 
USING (verification_status = 'approved');

-- Vendors can update their own public info
CREATE POLICY "Vendors can update own public info" 
ON vendor_public_info 
FOR UPDATE 
USING (id IN (
  SELECT up.id 
  FROM user_profiles up 
  WHERE up.user_id = auth.uid() AND up.role = 'vendor'
));

-- Vendors can insert their own public info
CREATE POLICY "Vendors can insert own public info" 
ON vendor_public_info 
FOR INSERT 
WITH CHECK (id IN (
  SELECT up.id 
  FROM user_profiles up 
  WHERE up.user_id = auth.uid() AND up.role = 'vendor'
));

-- Admins can manage all vendor public info
CREATE POLICY "Admins can manage all vendor public info" 
ON vendor_public_info 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- 2. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins
  FROM public.user_profiles;
$function$;

CREATE OR REPLACE FUNCTION public.get_platform_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint, total_requests bigint, total_offers bigint, total_orders bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins,
    (SELECT COUNT(*)::bigint FROM public.requests) as total_requests,
    (SELECT COUNT(*)::bigint FROM public.offers) as total_offers,
    (SELECT COUNT(*)::bigint FROM public.orders) as total_orders
  FROM public.user_profiles;
$function$;

CREATE OR REPLACE FUNCTION public.get_analytics_data()
RETURNS TABLE(total_users bigint, total_requests bigint, total_offers bigint, total_orders bigint, active_users bigint, total_revenue numeric, success_rate numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    (SELECT COUNT(*) FROM public.user_profiles) as total_users,
    (SELECT COUNT(*) FROM public.requests) as total_requests,
    (SELECT COUNT(*) FROM public.offers) as total_offers,
    (SELECT COUNT(*) FROM public.orders) as total_orders,
    (SELECT COUNT(*) FROM public.user_profiles WHERE updated_at > now() - interval '30 days') as active_users,
    (SELECT COALESCE(SUM(amount), 0) FROM public.financial_transactions WHERE status = 'completed') as total_revenue,
    (SELECT 
      CASE 
        WHEN COUNT(*) > 0 THEN 
          ROUND((COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric) * 100, 2)
        ELSE 0 
      END 
     FROM public.orders) as success_rate;
$function$;

CREATE OR REPLACE FUNCTION public.get_growth_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint, total_requests bigint, total_offers bigint, total_orders bigint, total_revenue numeric, total_transactions bigint, active_subscriptions bigint, users_growth numeric, requests_growth numeric, offers_growth numeric, revenue_growth numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  WITH current_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_users,
      COUNT(*) FILTER (WHERE role = 'client')::bigint as curr_clients,
      COUNT(*) FILTER (WHERE role = 'vendor')::bigint as curr_vendors,
      COUNT(*) FILTER (WHERE role = 'admin')::bigint as curr_admins
    FROM public.user_profiles
  ),
  previous_stats AS (
    SELECT 
      COUNT(*)::bigint as prev_users,
      COUNT(*) FILTER (WHERE role = 'client')::bigint as prev_clients,
      COUNT(*) FILTER (WHERE role = 'vendor')::bigint as prev_vendors,
      COUNT(*) FILTER (WHERE role = 'admin')::bigint as prev_admins
    FROM public.user_profiles
    WHERE created_at < date_trunc('month', CURRENT_DATE)
  ),
  request_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_requests,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::bigint as curr_month_requests,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND created_at < date_trunc('month', CURRENT_DATE))::bigint as prev_month_requests
    FROM public.requests
  ),
  offer_stats AS (
    SELECT 
      COUNT(*)::bigint as curr_offers,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE))::bigint as curr_month_offers,
      COUNT(*) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                      AND created_at < date_trunc('month', CURRENT_DATE))::bigint as prev_month_offers
    FROM public.offers
  ),
  financial_stats AS (
    SELECT 
      COUNT(*)::bigint as total_trans,
      COALESCE(SUM(amount), 0) as total_rev,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE)), 0) as curr_month_rev,
      COALESCE(SUM(amount) FILTER (WHERE created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') 
                                  AND created_at < date_trunc('month', CURRENT_DATE)), 0) as prev_month_rev
    FROM public.financial_transactions
    WHERE status = 'completed'
  ),
  subscription_stats AS (
    SELECT COUNT(*) FILTER (WHERE subscription_status = 'active')::bigint as active_subs
    FROM public.user_profiles
  )
  SELECT 
    cs.curr_users,
    cs.curr_clients,
    cs.curr_vendors, 
    cs.curr_admins,
    rs.curr_requests,
    os.curr_offers,
    (SELECT COUNT(*)::bigint FROM public.orders) as curr_orders,
    fs.total_rev,
    fs.total_trans,
    ss.active_subs,
    CASE 
      WHEN ps.prev_users > 0 THEN ROUND(((cs.curr_users - ps.prev_users)::numeric / ps.prev_users::numeric) * 100, 2)
      ELSE 0
    END as users_growth,
    CASE 
      WHEN rs.prev_month_requests > 0 THEN ROUND(((rs.curr_month_requests - rs.prev_month_requests)::numeric / rs.prev_month_requests::numeric) * 100, 2)
      ELSE 0
    END as requests_growth,
    CASE 
      WHEN os.prev_month_offers > 0 THEN ROUND(((os.curr_month_offers - os.prev_month_offers)::numeric / os.prev_month_offers::numeric) * 100, 2)
      ELSE 0
    END as offers_growth,
    CASE 
      WHEN fs.prev_month_rev > 0 THEN ROUND(((fs.curr_month_rev - fs.prev_month_rev)::numeric / fs.prev_month_rev::numeric) * 100, 2)
      ELSE 0
    END as revenue_growth
  FROM current_stats cs, previous_stats ps, request_stats rs, offer_stats os, financial_stats fs, subscription_stats ss;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_statistics(admin_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  result JSON;
  total_logins INTEGER := 0;
  failed_attempts INTEGER := 0;
  sessions_active INTEGER := 1;
  last_login TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if user is admin
  IF get_user_role(admin_user_id) != 'admin'::user_role THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  -- Get audit log data for login statistics
  SELECT 
    COUNT(*) FILTER (WHERE action = 'login_success'),
    COUNT(*) FILTER (WHERE action = 'login_failed'),
    MAX(created_at) FILTER (WHERE action = 'login_success')
  INTO total_logins, failed_attempts, last_login
  FROM audit_log 
  WHERE user_id = admin_user_id;

  -- Build result JSON
  result := json_build_object(
    'total_logins', COALESCE(total_logins, 0),
    'failed_attempts', COALESCE(failed_attempts, 0),
    'sessions_active', sessions_active,
    'last_login', COALESCE(last_login, now()),
    'permissions_granted', ARRAY[
      'users:read', 'users:write', 'users:delete',
      'analytics:read', 'reports:generate', 
      'system:admin', 'security:manage',
      'communications:send', 'verification:approve'
    ]
  );

  RETURN result;
END;
$function$;

-- 3. Create comprehensive audit logging for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT '{}'::jsonb,
  target_user_id UUID DEFAULT NULL
) 
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values,
    created_at
  ) VALUES (
    COALESCE(target_user_id, auth.uid()),
    event_type,
    'security_event',
    gen_random_uuid(),
    event_details || jsonb_build_object(
      'timestamp', NOW(),
      'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for',
      'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent'
    ),
    NOW()
  );
END;
$function$;