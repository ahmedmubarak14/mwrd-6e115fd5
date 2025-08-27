-- Create the missing get_user_statistics function that's being called by AdminDashboardStats
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE(total_users bigint, total_clients bigint, total_vendors bigint, total_admins bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    COUNT(*)::bigint as total_users,
    COUNT(*) FILTER (WHERE role = 'client')::bigint as total_clients,
    COUNT(*) FILTER (WHERE role = 'vendor')::bigint as total_vendors,
    COUNT(*) FILTER (WHERE role = 'admin')::bigint as total_admins
  FROM public.user_profiles;
$$;