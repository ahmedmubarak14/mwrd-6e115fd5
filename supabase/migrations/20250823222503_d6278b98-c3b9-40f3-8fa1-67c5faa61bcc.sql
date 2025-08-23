-- Create storage buckets for chat files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('chat-files', 'chat-files', false),
  ('chat-images', 'chat-images', true),
  ('voice-messages', 'voice-messages', false);

-- Create RLS policies for chat files
CREATE POLICY "Users can upload their own chat files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id IN ('chat-files', 'chat-images', 'voice-messages') AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view chat files in their conversations" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id IN ('chat-files', 'chat-images', 'voice-messages') AND 
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.messages m 
      WHERE m.attachment_url LIKE '%' || name || '%' 
      AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can delete their own chat files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id IN ('chat-files', 'chat-images', 'voice-messages') AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add file_metadata column to messages table for better file tracking
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS file_metadata JSONB DEFAULT NULL;

-- Update message_type to include more types
UPDATE public.messages SET message_type = 'text' WHERE message_type IS NULL;

-- Add index for better performance on attachment queries
CREATE INDEX IF NOT EXISTS idx_messages_attachment_url ON public.messages(attachment_url) WHERE attachment_url IS NOT NULL;