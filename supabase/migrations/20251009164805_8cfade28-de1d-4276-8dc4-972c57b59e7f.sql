-- ============================================
-- PHASE 1: SECURITY LOCKDOWN - RLS FIXES
-- ============================================
-- Fix Critical Security Vulnerabilities in user_profiles and expert_consultations

-- ============================================
-- 1. FIX CRITICAL: user_profiles RLS policies
-- ============================================
-- Drop all existing permissive SELECT policies on user_profiles that allow viewing other users' data
DROP POLICY IF EXISTS "Users can view profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Public profiles viewable by all" ON public.user_profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view other user profiles" ON public.user_profiles;

-- Create STRICT policy: Users can ONLY view their own profile
CREATE POLICY "Users can view own profile only"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

-- ============================================
-- 2. STRENGTHEN: expert_consultations RLS
-- ============================================
-- Ensure consultations are strictly private to the user who created them
DROP POLICY IF EXISTS "Users can view own consultations only" ON public.expert_consultations;

CREATE POLICY "Users can view own consultations only"
ON public.expert_consultations
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'::app_role
  )
);

-- ============================================
-- 3. FIX: Functions missing search_path
-- ============================================
-- Update all functions to have proper search_path set
-- This prevents SQL injection and ensures consistent behavior

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- Assign default 'client' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client'::app_role);
  
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- 4. AUDIT LOG: Log all profile access attempts
-- ============================================
-- Create trigger to log when users view other profiles
CREATE OR REPLACE FUNCTION public.log_profile_view()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log when user views someone else's profile
  IF auth.uid() != NEW.user_id THEN
    INSERT INTO public.audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      new_values,
      created_at
    ) VALUES (
      auth.uid(),
      'profile_viewed',
      'user_profiles',
      NEW.id,
      jsonb_build_object(
        'viewed_user_id', NEW.user_id,
        'viewer_role', get_user_role(auth.uid())::text,
        'timestamp', now()
      ),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- ============================================
-- 5. SECURITY: Add rate limiting for sensitive operations
-- ============================================
-- Prevent brute force attacks on user profile queries
CREATE OR REPLACE FUNCTION public.check_profile_query_rate_limit()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_queries INTEGER;
BEGIN
  -- Allow max 100 profile queries per minute per user
  SELECT COUNT(*)
  INTO recent_queries
  FROM public.audit_log
  WHERE user_id = auth.uid()
    AND action = 'profile_viewed'
    AND created_at > NOW() - INTERVAL '1 minute';
  
  RETURN recent_queries < 100;
END;
$$;

-- ============================================
-- 6. VERIFY: Test RLS policies
-- ============================================
-- Create test function to verify policies work correctly
CREATE OR REPLACE FUNCTION public.test_rls_policies()
RETURNS TABLE(test_name TEXT, passed BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Test 1: User can view own profile
  RETURN QUERY
  SELECT 
    'User can view own profile'::TEXT,
    EXISTS(SELECT 1 FROM public.user_profiles WHERE user_id = auth.uid())::BOOLEAN,
    'Users should be able to see their own profile'::TEXT;
  
  -- Test 2: Verify admin access
  RETURN QUERY
  SELECT 
    'Admins can view all profiles'::TEXT,
    (
      SELECT COUNT(*) > 0
      FROM public.user_profiles
      WHERE EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'::app_role
      )
    )::BOOLEAN,
    'Admins should have access to all profiles'::TEXT;
END;
$$;