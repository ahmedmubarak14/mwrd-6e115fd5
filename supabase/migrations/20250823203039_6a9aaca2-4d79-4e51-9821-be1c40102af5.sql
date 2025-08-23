-- Clean up any existing problematic users
DELETE FROM auth.users WHERE email = 'ahmedmubaraks@hotmail.com';
DELETE FROM public.user_profiles WHERE email = 'ahmedmubaraks@hotmail.com';

-- Add missing currency column to requests table
ALTER TABLE public.requests ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- Create get_platform_statistics function
CREATE OR REPLACE FUNCTION public.get_platform_statistics()
RETURNS TABLE(
  total_users bigint,
  total_clients bigint,
  total_vendors bigint,
  total_admins bigint,
  total_requests bigint,
  total_offers bigint,
  total_orders bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins,
    (SELECT COUNT(*)::bigint FROM public.requests) as total_requests,
    (SELECT COUNT(*)::bigint FROM public.offers) as total_offers,
    (SELECT COUNT(*)::bigint FROM public.orders) as total_orders
  FROM public.user_profiles;
$$;