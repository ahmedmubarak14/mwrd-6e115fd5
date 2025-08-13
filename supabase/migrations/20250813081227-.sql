-- Fix remaining security warnings by setting search_path on functions
-- Update existing functions to have explicit search_path

-- Fix the validation function we just created
CREATE OR REPLACE FUNCTION public.validate_consultation_user_id()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;