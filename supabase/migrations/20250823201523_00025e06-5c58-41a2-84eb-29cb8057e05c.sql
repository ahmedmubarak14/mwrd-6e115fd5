-- Fix the admin user authentication issue
-- First, remove the problematic user record
DELETE FROM auth.users WHERE email = 'ahmedmubaraks@hotmail.com';
DELETE FROM user_profiles WHERE email = 'ahmedmubaraks@hotmail.com';

-- Create admin user properly using Supabase's auth system
-- We'll use the admin API to create a confirmed user
SELECT auth.admin_create_user(
  email => 'ahmedmubaraks@hotmail.com',
  password => 'Aa123456',
  email_confirm => true,
  user_metadata => '{"role": "admin", "full_name": "Ahmed Mubarak"}'::jsonb
);