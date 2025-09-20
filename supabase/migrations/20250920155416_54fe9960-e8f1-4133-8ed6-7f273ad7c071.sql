-- Fix RLS on offers to allow inserts by adding WITH CHECK clauses
-- This ensures rows can be inserted when vendor_id = auth.uid() and by admins

ALTER POLICY "Vendors can manage own offers" ON public.offers
  USING (auth.uid() = vendor_id)
  WITH CHECK (auth.uid() = vendor_id);

ALTER POLICY "Admins can manage all offers" ON public.offers
  USING (get_user_role(auth.uid()) = 'admin'::user_role)
  WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);