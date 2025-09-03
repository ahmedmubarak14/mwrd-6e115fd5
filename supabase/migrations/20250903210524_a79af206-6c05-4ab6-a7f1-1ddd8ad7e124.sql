-- Fix vendor_business_directory public access issue
-- The view should only be accessible to authenticated users

-- Enable RLS on the vendor_business_directory view 
-- (Views inherit RLS from their base tables, but let's be explicit)
ALTER VIEW vendor_business_directory SET (security_invoker = true);

-- Ensure proper access control - revoke public access and grant to authenticated only
REVOKE ALL ON vendor_business_directory FROM PUBLIC;
REVOKE ALL ON vendor_business_directory FROM anon;
GRANT SELECT ON vendor_business_directory TO authenticated;

-- Also fix search_path for the user display function to improve security
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
SET search_path = public
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