-- First, let's check the current constraint and drop it
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add a new constraint that includes 'admin' as a valid role
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('client', 'supplier', 'admin'));

-- Now update the user to have admin role
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'ahmed@supplify.life';