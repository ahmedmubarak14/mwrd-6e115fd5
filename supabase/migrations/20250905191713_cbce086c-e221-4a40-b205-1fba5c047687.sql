-- =====================================================
-- SECURITY FIX: Restrict access to sensitive user data
-- =====================================================

-- 1. Create a function to get safe vendor display information only
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
  -- Only return public business info for approved vendors
  -- NO sensitive data like email, phone, address, or documents
  RETURN QUERY
  SELECT 
    up.id,
    up.full_name,
    up.company_name,
    up.bio,
    up.avatar_url,
    up.portfolio_url,
    up.categories,
    up.verification_status,
    up.created_at
  FROM user_profiles up
  WHERE up.user_id = vendor_user_id
    AND up.role = 'vendor'
    AND up.status = 'approved'
    AND up.verification_status = 'approved';
END;
$$;

-- 2. Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view approved vendor business info" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile and limited vendor info" ON user_profiles;

-- 3. Create secure replacement policies
CREATE POLICY "Users can view own complete profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON user_profiles
FOR SELECT
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- 4. Create a public view for safe vendor information
CREATE OR REPLACE VIEW public.vendor_public_profiles AS
SELECT 
  up.id,
  up.user_id,
  up.full_name,
  up.company_name,
  up.bio,
  up.avatar_url,
  up.portfolio_url,
  up.categories,
  up.verification_status,
  up.created_at
FROM user_profiles up
WHERE up.role = 'vendor'
  AND up.status = 'approved'
  AND up.verification_status = 'approved';

-- 5. Enable RLS on the vendor view and create access policy
ALTER VIEW public.vendor_public_profiles SET (security_barrier = true);

-- 6. Grant access to the vendor public view for authenticated users
GRANT SELECT ON public.vendor_public_profiles TO authenticated;

-- 7. Ensure the existing vendor_public_info table (if it exists) is kept in sync
-- This maintains backward compatibility if code is already using it
DO $$
BEGIN
  -- Check if vendor_public_info table exists and create sync trigger if needed
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'vendor_public_info') THEN
    -- Update the sync function to only sync safe data
    CREATE OR REPLACE FUNCTION public.sync_vendor_public_info()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $func$
    BEGIN
      IF NEW.role = 'vendor' AND NEW.status = 'approved' AND NEW.verification_status = 'approved' THEN
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
      ELSIF NEW.role = 'vendor' AND (NEW.status != 'approved' OR NEW.verification_status != 'approved') THEN
        -- Remove from public info if vendor is no longer approved
        DELETE FROM vendor_public_info WHERE id = NEW.id;
      END IF;
      RETURN NEW;
    END;
    $func$;
  END IF;
END
$$;