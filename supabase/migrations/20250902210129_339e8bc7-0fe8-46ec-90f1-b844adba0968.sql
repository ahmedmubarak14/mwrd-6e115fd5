-- Fix Function Search Path Mutable warning
-- Update functions to have immutable search_path

CREATE OR REPLACE FUNCTION public.check_support_ticket_rate_limit(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_count integer;
BEGIN
  -- Allow max 5 support tickets per hour per user
  SELECT COUNT(*)
  INTO recent_count
  FROM public.support_tickets
  WHERE user_id = user_uuid
    AND created_at > NOW() - INTERVAL '1 hour';
  
  RETURN recent_count < 5;
END;
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

CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.user_profiles WHERE user_id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_profile()
 RETURNS SETOF user_profiles
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT * FROM public.user_profiles WHERE user_id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_count integer;
BEGIN
  -- Allow max 3 consultations per hour per user
  SELECT COUNT(*)
  INTO recent_count
  FROM public.expert_consultations
  WHERE user_id = user_uuid
    AND created_at > NOW() - INTERVAL '1 hour';
  
  RETURN recent_count < 3;
END;
$function$;

-- Configure OTP settings to reduce expiry time
-- Note: This would typically be done in Supabase dashboard auth settings
-- We'll document this requirement for manual configuration

-- Enable leaked password protection
-- Note: This is also configured in Supabase dashboard auth settings
-- We'll document this requirement for manual configuration