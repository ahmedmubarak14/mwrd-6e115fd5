-- Add admin access to legacy storage buckets for KYC/KYV document viewing

-- Allow admins to read all files in chat-files bucket
CREATE POLICY "Admins can read all chat-files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-files'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Allow admins to read all files in chat-images bucket
CREATE POLICY "Admins can read all chat-images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-images'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Allow admins to manage chat-files for migration purposes
CREATE POLICY "Admins can manage chat-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'chat-files'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Allow admins to delete from chat-files after migration
CREATE POLICY "Admins can delete chat-files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'chat-files'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);