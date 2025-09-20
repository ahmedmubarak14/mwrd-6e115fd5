-- Align offers RLS with data model: vendor_id stores user_profiles.id, not auth.uid()
-- Update policies to map auth.uid() -> user_profiles.id for vendors

BEGIN;

-- Ensure policy exists before altering (safe pattern)
DO $$
BEGIN
  -- Vendors can manage own offers: USING and WITH CHECK via user_profiles mapping
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'offers' AND policyname = 'Vendors can manage own offers'
  ) THEN
    ALTER POLICY "Vendors can manage own offers" ON public.offers
      USING (
        vendor_id IN (
          SELECT up.id FROM public.user_profiles up
          WHERE up.user_id = auth.uid() AND up.role = 'vendor'
        )
      )
      WITH CHECK (
        vendor_id IN (
          SELECT up.id FROM public.user_profiles up
          WHERE up.user_id = auth.uid() AND up.role = 'vendor'
        )
      );
  END IF;

  -- Users can view relevant offers only: vendor sees own offers by profile.id, client sees offers for their requests, admins see all
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'offers' AND policyname = 'Users can view relevant offers only'
  ) THEN
    ALTER POLICY "Users can view relevant offers only" ON public.offers
      FOR SELECT
      USING (
        (
          vendor_id IN (
            SELECT up.id FROM public.user_profiles up
            WHERE up.user_id = auth.uid()
          )
        )
        OR (
          request_id IN (
            SELECT r.id FROM public.requests r
            WHERE r.client_id = auth.uid()
          )
        )
        OR (public.get_user_role(auth.uid()) = 'admin'::user_role)
      );
  END IF;

  -- Admins policy remains unchanged (already includes WITH CHECK)
END$$;

COMMIT;