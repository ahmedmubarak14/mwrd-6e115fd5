
-- Create proper RLS policy for admin access to chat-files bucket
CREATE POLICY "Admin access to chat-files bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-files' 
  AND (SELECT role FROM public.user_profiles WHERE user_id = auth.uid()) = 'admin'
);
