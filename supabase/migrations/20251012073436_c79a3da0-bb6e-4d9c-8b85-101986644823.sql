-- Add a computed column to user_profiles that fetches role from user_roles
-- This is read-only and automatically synced

CREATE OR REPLACE VIEW user_profiles_with_roles AS
SELECT 
  up.*,
  ur.role
FROM user_profiles up
LEFT JOIN user_roles ur ON up.user_id = ur.user_id;

-- Grant access to the view
GRANT SELECT ON user_profiles_with_roles TO authenticated, anon;

-- Add RLS policies to the view (same as user_profiles)
ALTER VIEW user_profiles_with_roles SET (security_invoker = on);