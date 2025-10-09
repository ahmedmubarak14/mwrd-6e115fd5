-- Test Data Seeding Script for Development/Testing
-- WARNING: Only run this on TEST/DEV databases, NEVER on production!

-- Create test users (passwords are hashed by auth system)
-- You'll need to use Supabase dashboard or auth.signUp() to create these

-- Example test data structure:
-- Test Client: testclient@example.com / TestPass123!
-- Test Vendor: testvendor@example.com / TestPass123!
-- Test Admin: testadmin@example.com / TestPass123!

-- After creating users via Supabase Auth, run this to set up profiles and roles:

-- Cleanup existing test data (optional)
DELETE FROM public.conversations WHERE client_id IN (
  SELECT id FROM public.user_profiles WHERE email LIKE 'test%@example.com'
);
DELETE FROM public.offers WHERE vendor_id IN (
  SELECT id FROM public.user_profiles WHERE email LIKE 'test%@example.com'
);
DELETE FROM public.requests WHERE client_id IN (
  SELECT user_id FROM auth.users WHERE email LIKE 'test%@example.com'
);
DELETE FROM public.user_roles WHERE user_id IN (
  SELECT id FROM auth.users WHERE email LIKE 'test%@example.com'
);
DELETE FROM public.user_profiles WHERE email LIKE 'test%@example.com';

-- Note: You'll need to get actual user_ids after creating users via Supabase Auth
-- Replace '<client_user_id>', '<vendor_user_id>', '<admin_user_id>' with actual UUIDs

-- Insert test user profiles
INSERT INTO public.user_profiles (
  user_id, email, full_name, role, status, verification_status, 
  company_name, phone, bio
) VALUES
  (
    '<client_user_id>', 
    'testclient@example.com', 
    'Test Client User', 
    'client', 
    'approved', 
    'approved',
    'Test Client Company LLC',
    '+966501234567',
    'Test client for automated testing'
  ),
  (
    '<vendor_user_id>',
    'testvendor@example.com',
    'Test Vendor User',
    'vendor',
    'approved',
    'approved',
    'Test Vendor Services LLC',
    '+966501234568',
    'Test vendor for automated testing'
  ),
  (
    '<admin_user_id>',
    'testadmin@example.com',
    'Test Admin User',
    'admin',
    'approved',
    'approved',
    'Platform Administration',
    '+966501234569',
    'Test admin for automated testing'
  )
ON CONFLICT (user_id) DO NOTHING;

-- Insert test user roles
INSERT INTO public.user_roles (user_id, role) VALUES
  ('<client_user_id>', 'client'),
  ('<vendor_user_id>', 'vendor'),
  ('<admin_user_id>', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert test request
INSERT INTO public.requests (
  id, client_id, title, description, category, budget_min, budget_max,
  deadline, status, urgency
) VALUES
  (
    gen_random_uuid(),
    '<client_user_id>',
    'Test IT Services Request',
    'We need comprehensive IT support and infrastructure services for our office',
    'IT Services',
    10000,
    50000,
    NOW() + INTERVAL '30 days',
    'open',
    'medium'
  )
ON CONFLICT DO NOTHING;

-- Instructions for using this script:
-- 1. First create test users via Supabase Dashboard Auth section
-- 2. Copy their user_ids
-- 3. Replace the placeholder user_ids in this script
-- 4. Run this script in Supabase SQL Editor
-- 5. Verify data was created correctly

COMMENT ON TABLE public.user_profiles IS 'Test data seeding requires manual user creation first';
