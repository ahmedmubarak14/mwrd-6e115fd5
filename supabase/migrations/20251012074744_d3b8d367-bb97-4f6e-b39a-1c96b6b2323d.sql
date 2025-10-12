-- Fix RLS policies for otp_verifications table
-- Remove the overly broad policy and add specific ones

DROP POLICY IF EXISTS "Service role can manage OTPs" ON public.otp_verifications;

-- Policy: Allow inserting OTPs (for send-otp function)
CREATE POLICY "Allow OTP creation"
  ON public.otp_verifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow reading OTPs for verification
CREATE POLICY "Allow OTP verification read"
  ON public.otp_verifications
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Allow updating OTPs after verification
CREATE POLICY "Allow OTP updates"
  ON public.otp_verifications
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow deleting expired OTPs
CREATE POLICY "Allow OTP deletion"
  ON public.otp_verifications
  FOR DELETE
  TO service_role
  USING (true);