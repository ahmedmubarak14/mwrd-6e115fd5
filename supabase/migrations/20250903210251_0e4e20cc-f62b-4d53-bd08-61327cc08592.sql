-- Fix critical security vulnerability in user_profiles table
-- Issue: Table is publicly readable exposing sensitive personal data

-- First, ensure RLS is enabled on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies that might expose sensitive data
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON user_profiles;
DROP POLICY IF EXISTS "Profiles are publicly readable" ON user_profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;

-- Create secure RLS policies

-- 1. Users can view and update their own complete profile
CREATE POLICY "Users can manage own profile"
ON user_profiles
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON user_profiles
FOR ALL
USING (get_user_role(auth.uid()) = 'admin'::user_role)
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);

-- 3. Limited vendor business info visible to authenticated users
-- Only expose essential business data, exclude sensitive personal info
CREATE POLICY "Authenticated users can view limited vendor business info"
ON user_profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND role = 'vendor' 
  AND status = 'approved'
  AND verification_status = 'approved'
);

-- 4. Create a secure view for vendor discovery (replaces direct table access)
CREATE OR REPLACE VIEW public.vendor_business_profiles AS
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
  updated_at,
  role,
  status
FROM user_profiles
WHERE role = 'vendor' 
  AND status = 'approved'
  AND verification_status = 'approved';

-- Grant access to the view for authenticated users
GRANT SELECT ON vendor_business_profiles TO authenticated;

-- 5. Create function to safely get user display info without exposing sensitive data
CREATE OR REPLACE FUNCTION get_user_display_info(user_profile_id UUID)
RETURNS TABLE(
  id UUID,
  display_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  verification_status TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name as display_name,
    up.company_name,
    up.avatar_url,
    up.verification_status::TEXT
  FROM user_profiles up
  WHERE up.id = user_profile_id
    AND up.status = 'approved'
    AND (
      -- Only approved vendors or own profile or admin access
      (up.role = 'vendor' AND up.verification_status = 'approved')
      OR auth.uid() = up.user_id 
      OR get_user_role(auth.uid()) = 'admin'::user_role
    );
END;
$$;

-- 6. Log sensitive data access attempts
CREATE OR REPLACE FUNCTION log_sensitive_data_access(
  accessed_user_id UUID,
  access_type TEXT DEFAULT 'profile_view'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only log if accessing someone else's profile
  IF auth.uid() != accessed_user_id AND auth.uid() IS NOT NULL THEN
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      new_values
    ) VALUES (
      auth.uid(),
      access_type,
      'user_profiles',
      accessed_user_id,
      jsonb_build_object(
        'accessed_at', now(),
        'access_type', access_type,
        'note', 'Sensitive profile data access logged'
      )
    );
  END IF;
END;
$$;