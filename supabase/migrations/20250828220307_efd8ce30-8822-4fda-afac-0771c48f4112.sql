-- Fix storage policies to allow admin access to CR documents

-- First, let's create a policy for admins to access all files in chat-files bucket
CREATE POLICY "Admins can access all files in chat-files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'chat-files' 
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to create signed URLs for any file
CREATE POLICY "Admins can create signed URLs for any file"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'chat-files' 
  AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Update verification_requests table to standardize document_url format
-- Convert full URLs to file paths only
UPDATE verification_requests 
SET document_url = CASE 
  WHEN document_url LIKE 'https://%/storage/v1/object/public/chat-files/%' 
  THEN SUBSTRING(document_url FROM 'https://[^/]+/storage/v1/object/public/chat-files/(.+)')
  ELSE document_url
END
WHERE document_url LIKE 'https://%';

-- Add an index for better performance on document_url lookups
CREATE INDEX IF NOT EXISTS idx_verification_requests_document_url 
ON verification_requests(document_url);

-- Add logging function for document access attempts
CREATE OR REPLACE FUNCTION log_document_access_attempt(
  file_path TEXT,
  user_role TEXT,
  success BOOLEAN,
  error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    'document_access_attempt',
    'storage_object',
    gen_random_uuid(),
    jsonb_build_object(
      'file_path', file_path,
      'user_role', user_role,
      'success', success,
      'error_message', error_message,
      'timestamp', NOW()
    ),
    NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;