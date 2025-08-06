-- Update the is_admin() function to query user_profiles table directly
-- This prevents issues with JWT metadata not being set correctly
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the current user has admin role in user_profiles table
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;