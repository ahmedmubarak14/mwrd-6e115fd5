-- Fix the missing company name for Ahmed Mubarak client
UPDATE public.user_profiles 
SET company_name = 'Al-Mubarak Trading Company'
WHERE id = 'f841e31e-c3df-4167-824a-41e7942ec309' AND role = 'client';