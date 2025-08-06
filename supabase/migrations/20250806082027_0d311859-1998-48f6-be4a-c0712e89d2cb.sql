-- Update user role from client to supplier
UPDATE public.user_profiles 
SET role = 'supplier' 
WHERE email = 'ahmedmubarak1@hotmail.co.uk';