-- Create storage bucket for chat attachments (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and create new ones
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can upload their own chat attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view chat attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own chat attachments" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own chat attachments" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Users can upload their own chat attachments" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (bucket_id = 'chat-attachments' AND auth.uid() IS NOT NULL);

    CREATE POLICY "Users can view chat attachments" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'chat-attachments');

    CREATE POLICY "Users can update their own chat attachments" 
    ON storage.objects 
    FOR UPDATE 
    USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "Users can delete their own chat attachments" 
    ON storage.objects 
    FOR DELETE 
    USING (bucket_id = 'chat-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
END
$$;