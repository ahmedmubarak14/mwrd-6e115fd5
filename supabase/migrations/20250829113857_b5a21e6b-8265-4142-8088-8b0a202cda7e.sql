-- Fix the search path security warning by recreating the function properly
-- First drop the policy that depends on the function
DROP POLICY IF EXISTS "Authenticated users can insert consultations with rate limit" ON public.expert_consultations;

-- Drop the function
DROP FUNCTION IF EXISTS public.check_consultation_rate_limit(uuid);

-- Recreate the function with proper search path
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

-- Recreate the policy using the function
CREATE POLICY "Authenticated users can insert consultations with rate limit" 
ON public.expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.check_consultation_rate_limit(auth.uid())
);