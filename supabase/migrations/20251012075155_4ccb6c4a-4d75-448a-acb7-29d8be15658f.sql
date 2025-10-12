-- Fix handle_new_user trigger function
-- The function should not try to access NEW.role since auth.users doesn't have that field
-- Instead, read role from raw_user_meta_data and ensure proper separation

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Extract role from metadata, default to 'client'
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'client'::app_role
  );

  -- Create user profile (without role - roles are in separate table)
  INSERT INTO public.user_profiles (user_id, email, full_name, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'company_name'
  );
  
  -- Assign role in separate user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Creates user profile and assigns role when new user signs up. Roles are stored separately for security.';