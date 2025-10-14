-- Create dedicated KYV documents bucket (PRIVATE)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyv-documents', 
  'kyv-documents', 
  false,
  52428800, -- 50MB limit
  ARRAY[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
);

-- RLS Policy: Only admins can read KYV documents
CREATE POLICY "Admins can read KYV documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyv-documents' 
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- RLS Policy: Vendors can upload their own KYV documents
CREATE POLICY "Vendors can upload own KYV documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyv-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Admins can update KYV documents
CREATE POLICY "Admins can update KYV documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'kyv-documents'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- RLS Policy: Admins can delete KYV documents
CREATE POLICY "Admins can delete KYV documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'kyv-documents'
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);