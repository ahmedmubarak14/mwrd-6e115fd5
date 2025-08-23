-- Create admin user account
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'ahmedmubaraks@hotmail.com',
  crypt('Aa123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"role": "admin", "full_name": "Ahmed Mubarak"}'::jsonb,
  'authenticated',
  'authenticated'
);

-- Create corresponding profile (will be handled by trigger, but let's ensure it's admin)
UPDATE user_profiles 
SET role = 'admin', status = 'approved'
WHERE email = 'ahmedmubaraks@hotmail.com';