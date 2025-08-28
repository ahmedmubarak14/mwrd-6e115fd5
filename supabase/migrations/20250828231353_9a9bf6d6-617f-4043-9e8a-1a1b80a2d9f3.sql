-- Fix critical security vulnerabilities

-- 1. Drop and recreate vendor_public_info as a proper table with RLS
DROP VIEW IF EXISTS vendor_public_info;

CREATE TABLE vendor_public_info (
  id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  full_name text,
  company_name text,
  bio text,
  avatar_url text,
  portfolio_url text,
  categories text[],
  verification_status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE vendor_public_info ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendor_public_info
CREATE POLICY "Anyone can view approved vendor info" 
ON vendor_public_info 
FOR SELECT 
USING (verification_status = 'approved');

CREATE POLICY "Vendors can manage own public info" 
ON vendor_public_info 
FOR ALL
USING (id IN (
  SELECT up.id 
  FROM user_profiles up 
  WHERE up.user_id = auth.uid() AND up.role = 'vendor'
));

CREATE POLICY "Admins can manage all vendor public info" 
ON vendor_public_info 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- Create trigger to auto-update vendor_public_info when user_profiles changes
CREATE OR REPLACE FUNCTION sync_vendor_public_info()
RETURNS trigger AS $$
BEGIN
  IF NEW.role = 'vendor' THEN
    INSERT INTO vendor_public_info (
      id, full_name, company_name, bio, avatar_url, 
      portfolio_url, categories, verification_status
    )
    VALUES (
      NEW.id, NEW.full_name, NEW.company_name, NEW.bio, 
      NEW.avatar_url, NEW.portfolio_url, NEW.categories, NEW.verification_status
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = NEW.full_name,
      company_name = NEW.company_name,
      bio = NEW.bio,
      avatar_url = NEW.avatar_url,
      portfolio_url = NEW.portfolio_url,
      categories = NEW.categories,
      verification_status = NEW.verification_status,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for the sync function
DROP TRIGGER IF EXISTS sync_vendor_public_info_on_insert ON user_profiles;
DROP TRIGGER IF EXISTS sync_vendor_public_info_on_update ON user_profiles;

CREATE TRIGGER sync_vendor_public_info_on_insert
  AFTER INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_vendor_public_info();

CREATE TRIGGER sync_vendor_public_info_on_update
  AFTER UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION sync_vendor_public_info();

-- 2. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid LIMIT 1;
$function$;

-- 3. Create comprehensive audit logging for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT '{}'::jsonb,
  target_user_id UUID DEFAULT NULL
) 
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values,
    created_at
  ) VALUES (
    COALESCE(target_user_id, auth.uid()),
    event_type,
    'security_event',
    gen_random_uuid(),
    event_details || jsonb_build_object(
      'timestamp', NOW(),
      'source', 'application'
    ),
    NOW()
  );
END;
$function$;

-- 4. Populate existing vendor data
INSERT INTO vendor_public_info (
  id, full_name, company_name, bio, avatar_url, 
  portfolio_url, categories, verification_status, created_at
)
SELECT 
  id, full_name, company_name, bio, avatar_url,
  portfolio_url, categories, verification_status, created_at
FROM user_profiles 
WHERE role = 'vendor'
ON CONFLICT (id) DO NOTHING;