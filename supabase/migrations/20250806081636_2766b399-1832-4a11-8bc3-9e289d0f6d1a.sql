-- Grant admin role to an existing user
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'ahmed@supplify.life';