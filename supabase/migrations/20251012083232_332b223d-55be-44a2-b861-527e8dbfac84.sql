-- Allow users to list files in their own folders for verification
CREATE POLICY "Users can list own files for verification"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);