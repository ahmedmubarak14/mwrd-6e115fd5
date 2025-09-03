-- Fix critical security vulnerability in user_profiles table
-- Remove overly permissive policies and add secure vendor access

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any dangerously permissive policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON user_profiles;

-- Add secure policy for limited vendor business information
-- Only authenticated users can see approved vendor business info (not personal data)
CREATE POLICY "Authenticated users can view approved vendor business info"
ON user_profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND role = 'vendor' 
  AND status = 'approved'
  AND verification_status = 'approved'
);

-- Create secure view that excludes sensitive personal data
CREATE OR REPLACE VIEW public.vendor_business_directory AS
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

-- Grant SELECT access to authenticated users only
REVOKE ALL ON vendor_business_directory FROM PUBLIC;
GRANT SELECT ON vendor_business_directory TO authenticated;

-- Create function to safely access user display info
CREATE OR REPLACE FUNCTION get_safe_user_display_info(target_user_id UUID)
RETURNS TABLE(
  display_name TEXT,
  company_name TEXT,
  avatar_url TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
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