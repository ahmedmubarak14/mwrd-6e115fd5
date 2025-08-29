-- Fix the search path security warning for the rate limiting function
DROP FUNCTION IF EXISTS public.check_consultation_rate_limit(uuid);

CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Check if user has submitted more than 3 consultations in the last hour
  SELECT COUNT(*)
  INTO recent_count
  FROM public.expert_consultations
  WHERE user_id = user_uuid
    AND created_at > NOW() - INTERVAL '1 hour';
  
  RETURN recent_count < 3;
END;
$$;