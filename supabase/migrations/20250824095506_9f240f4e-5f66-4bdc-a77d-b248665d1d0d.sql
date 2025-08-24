
-- Add verification-related columns to user_profiles table if not already present
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'under_review')),
ADD COLUMN IF NOT EXISTS verification_notes text,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verified_by uuid REFERENCES auth.users(id);

-- Create verification requests table for tracking document submissions
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'commercial_registration',
  document_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  reviewed_at timestamp with time zone,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewer_notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on verification_requests
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for verification_requests
CREATE POLICY "Users can view own verification requests" 
ON verification_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verification requests" 
ON verification_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all verification requests" 
ON verification_requests FOR ALL 
USING (get_user_role(auth.uid()) = 'admin');

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update user profile when verification is approved
CREATE OR REPLACE FUNCTION handle_verification_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE user_profiles 
    SET 
      verification_status = 'approved',
      verified_at = NEW.reviewed_at,
      verified_by = NEW.reviewed_by,
      status = 'approved'
    WHERE user_id = NEW.user_id;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE user_profiles 
    SET 
      verification_status = 'rejected',
      verification_notes = NEW.reviewer_notes
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for verification approval
DROP TRIGGER IF EXISTS verification_approval_trigger ON verification_requests;
CREATE TRIGGER verification_approval_trigger
  AFTER UPDATE ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_verification_approval();
