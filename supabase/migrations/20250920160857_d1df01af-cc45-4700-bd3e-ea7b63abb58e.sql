-- Drop and recreate RLS policies for offers with correct vendor_id mapping
-- vendor_id column stores user_profiles.id, not auth.uid()

DROP POLICY IF EXISTS "Vendors can manage own offers" ON public.offers;
DROP POLICY IF EXISTS "Users can view relevant offers only" ON public.offers;

-- Vendors can manage their offers by mapping auth.uid() -> user_profiles.id
CREATE POLICY "Vendors can manage own offers" ON public.offers
  FOR ALL
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

-- Users can view relevant offers: vendors see own via profile mapping, clients see offers for their requests, admins see all
CREATE POLICY "Users can view relevant offers only" ON public.offers
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