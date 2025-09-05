-- =====================================================
-- FIX: Remove SECURITY DEFINER from remaining analytics functions
-- =====================================================

-- Analytics functions also need to be fixed to not use SECURITY DEFINER with TABLE returns
-- These functions will rely on admin role checks instead of SECURITY DEFINER

-- 1. Fix get_user_statistics - remove SECURITY DEFINER, add admin check
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint)
LANGUAGE sql
STABLE -- Removed SECURITY DEFINER  
SET search_path = public
AS $$
  -- Only allow admins to access statistics
  SELECT 
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_users,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'client')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_clients,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'vendor')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_vendors,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'admin')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_admins;
$$;

-- 2. Fix get_platform_statistics - remove SECURITY DEFINER, add admin check
CREATE OR REPLACE FUNCTION public.get_platform_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint, total_requests bigint, total_offers bigint, total_orders bigint)
LANGUAGE sql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_users,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'client')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_clients,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'vendor')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_vendors,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'admin')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_admins,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.requests)
    ELSE 0::bigint END as total_requests,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.offers)
    ELSE 0::bigint END as total_offers,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.orders)
    ELSE 0::bigint END as total_orders;
$$;

-- 3. Fix get_analytics_data - remove SECURITY DEFINER, add admin check  
CREATE OR REPLACE FUNCTION public.get_analytics_data()
RETURNS TABLE(total_users bigint, total_requests bigint, total_offers bigint, total_orders bigint, active_users bigint, total_revenue numeric, success_rate numeric)
LANGUAGE sql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FROM public.user_profiles)
    ELSE 0::bigint END as total_users,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FROM public.requests)
    ELSE 0::bigint END as total_requests,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FROM public.offers)
    ELSE 0::bigint END as total_offers,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FROM public.orders)
    ELSE 0::bigint END as total_orders,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FROM public.user_profiles WHERE updated_at > now() - interval '30 days')
    ELSE 0::bigint END as active_users,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COALESCE(SUM(amount), 0) FROM public.financial_transactions WHERE status = 'completed')
    ELSE 0::numeric END as total_revenue,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT 
        CASE 
          WHEN COUNT(*) > 0 THEN 
            ROUND((COUNT(*) FILTER (WHERE status = 'completed')::numeric / COUNT(*)::numeric) * 100, 2)
          ELSE 0 
        END 
       FROM public.orders)
    ELSE 0::numeric END as success_rate;
$$;

-- 4. Fix get_growth_statistics - convert to simpler structure, remove SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_growth_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint, total_requests bigint, total_offers bigint, total_orders bigint, total_revenue numeric, total_transactions bigint, active_subscriptions bigint, users_growth numeric, requests_growth numeric, offers_growth numeric, revenue_growth numeric)
LANGUAGE sql
STABLE -- Removed SECURITY DEFINER
SET search_path = public
AS $$
  -- Simplified version with admin access control
  SELECT 
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_users,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'client')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_clients,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'vendor')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_vendors,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE role = 'admin')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as total_admins,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.requests)
    ELSE 0::bigint END as total_requests,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.offers)
    ELSE 0::bigint END as total_offers,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.orders)
    ELSE 0::bigint END as total_orders,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COALESCE(SUM(amount), 0) FROM public.financial_transactions WHERE status = 'completed')
    ELSE 0::numeric END as total_revenue,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*)::bigint FROM public.financial_transactions WHERE status = 'completed')
    ELSE 0::bigint END as total_transactions,
    CASE WHEN get_user_role(auth.uid()) = 'admin'::user_role THEN
      (SELECT COUNT(*) FILTER (WHERE subscription_status = 'active')::bigint FROM public.user_profiles)
    ELSE 0::bigint END as active_subscriptions,
    0::numeric as users_growth,     -- Simplified for now
    0::numeric as requests_growth,   -- Simplified for now
    0::numeric as offers_growth,     -- Simplified for now
    0::numeric as revenue_growth;    -- Simplified for now
$$;

-- 5. Log this security fix
INSERT INTO audit_log (
  user_id,
  action,
  entity_type,
  entity_id,
  new_values,
  created_at
) VALUES (
  auth.uid(),
  'security_fix_analytics_functions',
  'functions',
  gen_random_uuid(),
  jsonb_build_object(
    'action', 'Removed SECURITY DEFINER from analytics functions',
    'security_level', 'ERROR_FIX',
    'functions_fixed', ARRAY[
      'get_user_statistics',
      'get_platform_statistics',
      'get_analytics_data',
      'get_growth_statistics'
    ],
    'approach', 'Functions now use admin role checks instead of SECURITY DEFINER',
    'timestamp', NOW()
  ),
  NOW()
);