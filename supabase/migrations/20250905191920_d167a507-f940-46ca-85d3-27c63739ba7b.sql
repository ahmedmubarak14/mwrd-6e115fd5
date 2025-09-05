-- =====================================================
-- FIX: Remove security definer view and replace with safe approach
-- =====================================================

-- 1. Drop the problematic security definer view
DROP VIEW IF EXISTS public.vendor_public_profiles;

-- 2. Create a regular table for public vendor information (if not exists)
CREATE TABLE IF NOT EXISTS public.vendor_public_info (
  id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  company_name text,
  bio text,
  avatar_url text,
  portfolio_url text,
  categories text[],
  verification_status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Enable RLS on vendor_public_info
ALTER TABLE public.vendor_public_info ENABLE ROW LEVEL SECURITY;

-- 4. Create safe RLS policies for vendor_public_info
CREATE POLICY "Anyone can view approved vendor public info"
ON public.vendor_public_info
FOR SELECT
USING (verification_status = 'approved');

CREATE POLICY "System can manage vendor public info"
ON public.vendor_public_info
FOR ALL
USING (false) -- No direct user access, only through triggers
WITH CHECK (false);

-- 5. Create or update the sync trigger
CREATE OR REPLACE FUNCTION public.sync_vendor_public_info()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role = 'vendor' AND NEW.status = 'approved' AND NEW.verification_status = 'approved' THEN
    -- Insert or update approved vendor info
    INSERT INTO vendor_public_info (
      id, full_name, company_name, bio, avatar_url, 
      portfolio_url, categories, verification_status, updated_at
    )
    VALUES (
      NEW.id, NEW.full_name, NEW.company_name, NEW.bio, 
      NEW.avatar_url, NEW.portfolio_url, NEW.categories, NEW.verification_status, now()
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
  ELSIF OLD.role = 'vendor' AND (NEW.status != 'approved' OR NEW.verification_status != 'approved') THEN
    -- Remove from public info if vendor is no longer approved
    DELETE FROM vendor_public_info WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS sync_vendor_public_info_trigger ON public.user_profiles;
CREATE TRIGGER sync_vendor_public_info_trigger
  AFTER INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vendor_public_info();

-- 7. Update the get_vendor_public_info function to use the safe table
CREATE OR REPLACE FUNCTION public.get_vendor_public_info(vendor_user_id uuid)
RETURNS TABLE(
  id uuid,
  full_name text,
  company_name text,
  bio text,
  avatar_url text,
  portfolio_url text,
  categories text[],
  verification_status text,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return data from the safe public table instead of user_profiles directly
  RETURN QUERY
  SELECT 
    vpi.id,
    vpi.full_name,
    vpi.company_name,
    vpi.bio,
    vpi.avatar_url,
    vpi.portfolio_url,
    vpi.categories,
    vpi.verification_status,
    vpi.created_at
  FROM vendor_public_info vpi
  JOIN user_profiles up ON vpi.id = up.id
  WHERE up.user_id = vendor_user_id
    AND vpi.verification_status = 'approved';
END;
$$;

-- 8. Populate the vendor_public_info table with existing approved vendors
INSERT INTO vendor_public_info (
  id, full_name, company_name, bio, avatar_url, 
  portfolio_url, categories, verification_status, created_at, updated_at
)
SELECT 
  id, full_name, company_name, bio, avatar_url, 
  portfolio_url, categories, verification_status, created_at, updated_at
FROM user_profiles
WHERE role = 'vendor' 
  AND status = 'approved' 
  AND verification_status = 'approved'
ON CONFLICT (id) DO NOTHING;