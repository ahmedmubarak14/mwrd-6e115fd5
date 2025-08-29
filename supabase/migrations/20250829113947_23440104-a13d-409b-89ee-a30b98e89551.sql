-- Fix Security Issue: Secure expert_consultations table against data harvesting
-- Step 1: Check current policies and drop the problematic one

DROP POLICY IF EXISTS "Authenticated users can insert consultations" ON public.expert_consultations;
DROP POLICY IF EXISTS "Authenticated users can insert consultations with rate limit" ON public.expert_consultations;

-- Step 2: Create a secure policy that requires authentication AND proper user ownership
CREATE POLICY "Secure consultation submissions only" 
ON public.expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id
);

-- Step 3: Create rate limiting function to prevent spam
CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Step 4: Add rate limiting to the policy
DROP POLICY IF EXISTS "Secure consultation submissions only" ON public.expert_consultations;

CREATE POLICY "Authenticated consultation submissions with limits" 
ON public.expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.check_consultation_rate_limit(auth.uid())
);

-- Step 5: Add performance index
CREATE INDEX IF NOT EXISTS idx_expert_consultations_user_id_created 
ON public.expert_consultations(user_id, created_at DESC);