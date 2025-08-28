-- Remove admin approval requirement from offers workflow
-- Update offers table to make admin_approval_status optional and default to approved
ALTER TABLE offers ALTER COLUMN admin_approval_status SET DEFAULT 'approved';

-- Update existing offers to be approved by default
UPDATE offers SET admin_approval_status = 'approved' WHERE admin_approval_status = 'pending';

-- Remove admin approval checks from offer visibility policies
DROP POLICY IF EXISTS "Users can view relevant offers only" ON offers;
CREATE POLICY "Users can view relevant offers only" 
ON offers FOR SELECT 
USING (
  auth.uid() = vendor_id OR 
  request_id IN (
    SELECT requests.id FROM requests 
    WHERE requests.client_id = auth.uid()
  ) OR 
  get_user_role(auth.uid()) = 'admin'
);

-- Update offer creation to automatically approve from admin side
CREATE OR REPLACE FUNCTION auto_approve_offers()
RETURNS trigger AS $$
BEGIN
  -- Automatically approve offers from admin perspective
  NEW.admin_approval_status = 'approved';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_auto_approve_offers ON offers;
CREATE TRIGGER trigger_auto_approve_offers
  BEFORE INSERT ON offers
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_offers();