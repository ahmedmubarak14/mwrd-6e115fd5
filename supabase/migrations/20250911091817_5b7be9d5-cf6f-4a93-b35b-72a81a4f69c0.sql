-- Add policy to allow public access to approved vendor profiles
CREATE POLICY "Public can view approved vendor profiles" ON user_profiles
FOR SELECT
USING (
  role = 'vendor' 
  AND status = 'approved' 
  AND verification_status = 'approved'
);