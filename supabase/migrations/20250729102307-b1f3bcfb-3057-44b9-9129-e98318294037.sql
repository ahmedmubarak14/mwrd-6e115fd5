-- Fix infinite recursion in user_profiles RLS policies
-- The issue is that admin policies are querying user_profiles table within the same table's policies

-- Drop the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert any profile" ON user_profiles;

-- Create a simple admin function that doesn't cause recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role without querying user_profiles table
  -- This prevents infinite recursion
  RETURN (
    SELECT COALESCE(
      (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin',
      false
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate admin policies without recursion
CREATE POLICY "Admins can view all profiles" ON user_profiles 
FOR SELECT USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON user_profiles 
FOR UPDATE USING (is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can insert any profile" ON user_profiles 
FOR INSERT WITH CHECK (is_admin() OR auth.uid() = id);

-- Update the existing user policies to be more explicit
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

CREATE POLICY "Users can view their own profile" ON user_profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles 
FOR INSERT WITH CHECK (auth.uid() = id);