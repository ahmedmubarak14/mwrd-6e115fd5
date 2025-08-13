-- Fix security vulnerability in expert_consultations table
-- Remove the ability to create consultations with null user_id
-- Ensure only authenticated users can create consultations and only view their own

-- First, update any existing records with null user_id to a placeholder if needed
-- For this fix, we'll require authentication, so we'll drop and recreate the policies

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can create consultation requests" ON public.expert_consultations;
DROP POLICY IF EXISTS "Users can view their own consultation requests" ON public.expert_consultations;

-- Create secure policies that require authentication
CREATE POLICY "Authenticated users can create their own consultation requests"
ON public.expert_consultations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND user_id IS NOT NULL);

CREATE POLICY "Users can view only their own consultation requests"
ON public.expert_consultations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- Ensure user_id cannot be null for new records by adding a validation trigger
CREATE OR REPLACE FUNCTION public.validate_consultation_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure user_id is not null for new consultations
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Consultation requests must be associated with an authenticated user' USING ERRCODE = '23502';
  END IF;
  
  -- Ensure the user_id matches the authenticated user (additional security)
  IF auth.uid() != NEW.user_id AND NOT is_admin() THEN
    RAISE EXCEPTION 'Users can only create consultations for themselves' USING ERRCODE = '42501';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the validation trigger
CREATE TRIGGER validate_consultation_user_id_trigger
  BEFORE INSERT ON public.expert_consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_consultation_user_id();