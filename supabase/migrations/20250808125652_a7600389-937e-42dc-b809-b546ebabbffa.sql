-- Create file_uploads table for tracking uploaded files
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for file uploads
CREATE POLICY "Users can view their own uploads" 
ON public.file_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own uploads" 
ON public.file_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads" 
ON public.file_uploads 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create file_attachments table for linking files to requests/offers
CREATE TABLE public.file_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_upload_id UUID NOT NULL REFERENCES public.file_uploads(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL, -- 'request', 'offer', 'message'
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for file attachments
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for file attachments
CREATE POLICY "Users can view attachments for entities they have access to" 
ON public.file_attachments 
FOR SELECT 
USING (
  file_upload_id IN (
    SELECT id FROM public.file_uploads WHERE user_id = auth.uid()
  ) OR
  (entity_type = 'request' AND entity_id IN (
    SELECT id FROM public.requests WHERE user_id = auth.uid()
  )) OR
  (entity_type = 'offer' AND entity_id IN (
    SELECT id FROM public.offers WHERE supplier_id = auth.uid()
  ))
);

CREATE POLICY "Users can create attachments for their files" 
ON public.file_attachments 
FOR INSERT 
WITH CHECK (
  file_upload_id IN (
    SELECT id FROM public.file_uploads WHERE user_id = auth.uid()
  )
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for documents
CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add trigger for updated_at
CREATE TRIGGER update_file_uploads_updated_at
BEFORE UPDATE ON public.file_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();