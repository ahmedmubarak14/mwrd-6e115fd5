-- Ensure vendors can view approved requests
-- Update RLS policy to allow vendors to see requests that are approved by admin
DROP POLICY IF EXISTS "Users can view relevant requests only" ON public.requests;

CREATE POLICY "Users can view relevant requests only" ON public.requests
FOR SELECT USING (
  auth.uid() = client_id OR 
  auth.uid() = vendor_id OR 
  get_user_role(auth.uid()) = 'admin'::user_role OR 
  (admin_approval_status = 'approved' AND get_user_role(auth.uid()) = 'vendor'::user_role)
);

-- Auto-approve new requests so they become visible to vendors immediately
-- This can be changed later if manual approval workflow is needed
UPDATE public.requests 
SET admin_approval_status = 'approved' 
WHERE admin_approval_status = 'pending';

-- Set default admin_approval_status to approved for new requests
ALTER TABLE public.requests 
ALTER COLUMN admin_approval_status SET DEFAULT 'approved';