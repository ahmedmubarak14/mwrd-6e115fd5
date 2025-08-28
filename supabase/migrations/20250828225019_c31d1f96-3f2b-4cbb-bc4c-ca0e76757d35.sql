-- Fix conversations RLS policies to work with profile IDs instead of user IDs

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view own conversations only" ON conversations;

-- Create new policies that work with profile IDs
CREATE POLICY "Users can insert conversations" ON conversations
FOR INSERT 
WITH CHECK (
  client_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
  vendor_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update their conversations" ON conversations
FOR UPDATE 
USING (
  client_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
  vendor_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
  get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Users can view own conversations only" ON conversations
FOR SELECT 
USING (
  client_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
  vendor_id IN (SELECT id FROM user_profiles WHERE user_id = auth.uid()) OR
  get_user_role(auth.uid()) = 'admin'::user_role
);