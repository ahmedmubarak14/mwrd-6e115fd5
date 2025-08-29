-- Fix Security Issue: Remove unauthenticated access to expert_consultations table
-- This prevents spammers from harvesting customer data and flooding the system

-- Drop the current problematic INSERT policy that allows unauthenticated users
DROP POLICY IF EXISTS "Authenticated users can insert consultations" ON public.expert_consultations;

-- Create a new secure INSERT policy that requires authentication
CREATE POLICY "Authenticated users can insert their own consultations" 
ON public.expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Update the user_id column to be NOT NULL to enforce data integrity
-- This ensures every consultation is linked to an authenticated user
ALTER TABLE public.expert_consultations 
ALTER COLUMN user_id SET NOT NULL;

-- Add an index for better performance on user_id lookups
CREATE INDEX IF NOT EXISTS idx_expert_consultations_user_id 
ON public.expert_consultations(user_id);

-- Create a rate limiting function to prevent spam (optional but recommended)
CREATE OR REPLACE FUNCTION public.check_consultation_rate_limit(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Add rate limiting to the INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert their own consultations" ON public.expert_consultations;

CREATE POLICY "Authenticated users can insert consultations with rate limit" 
ON public.expert_consultations 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND auth.uid() = user_id 
  AND public.check_consultation_rate_limit(auth.uid())
);