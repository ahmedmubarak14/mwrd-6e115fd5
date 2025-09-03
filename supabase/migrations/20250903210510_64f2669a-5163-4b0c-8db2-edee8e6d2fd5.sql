-- Fix security warnings from previous migration

-- 1. Fix the view to use proper security model instead of security definer
DROP VIEW IF EXISTS vendor_business_directory;

-- Create a standard view without security definer
CREATE VIEW public.vendor_business_directory AS
SELECT 
  id,
  full_name,
  company_name,
  bio,
  avatar_url,
  portfolio_url,
  categories,
  verification_status,
  created_at,
  role,
  status
FROM user_profiles
WHERE role = 'vendor' 
  AND status = 'approved'
  AND verification_status = 'approved';

-- Enable RLS on the view with proper policies
ALTER TABLE vendor_business_directory ENABLE ROW LEVEL SECURITY;

-- Create policy for the view that allows authenticated users to see approved vendors
CREATE POLICY "Authenticated users can view vendor directory"
ON vendor_business_directory
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. Fix the function to have proper search_path
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
    FROM user_profiles up
    WHERE up.user_id = target_user_id;
  ELSIF EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = target_user_id 
      AND up.role = 'vendor' 
      AND up.status = 'approved'
      AND up.verification_status = 'approved'
  ) THEN
    RETURN QUERY
    SELECT up.full_name, up.company_name, up.avatar_url
    FROM user_profiles up
    WHERE up.user_id = target_user_id;
  END IF;
END;
$$;