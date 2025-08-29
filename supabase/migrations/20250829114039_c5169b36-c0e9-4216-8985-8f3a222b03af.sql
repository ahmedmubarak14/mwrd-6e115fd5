-- Fix security warning: Set proper search path for the rate limiting function
CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;