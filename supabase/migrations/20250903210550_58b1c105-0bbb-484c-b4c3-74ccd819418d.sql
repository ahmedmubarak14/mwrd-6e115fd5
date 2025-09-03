-- Fix only the function search_path security warning

-- Drop and recreate the function with proper search_path
DROP FUNCTION IF EXISTS get_safe_user_display_info(UUID);

CREATE OR REPLACE FUNCTION get_safe_user_display_info(target_user_id UUID)
RETURNS TABLE(
  display_name TEXT,
  company_name TEXT,
  avatar_url TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
BEGIN
  -- Only return data if it's the user's own profile, admin, or approved vendor
  IF auth.uid() = target_user_id OR get_user_role(auth.uid()) = 'admin'::user_role THEN
    RETURN QUERY
    SELECT up.full_name, up.company_name, up.avatar_url
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id;
  ELSIF EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = target_user_id 
      AND up.role = 'vendor' 
      AND up.status = 'approved'
      AND up.verification_status = 'approved'
  ) THEN
    RETURN QUERY
    SELECT up.full_name, up.company_name, up.avatar_url
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id;
  END IF;
END;
$$;

-- Remove the problematic view and rely on the secure RLS policies instead
DROP VIEW IF EXISTS vendor_business_directory;