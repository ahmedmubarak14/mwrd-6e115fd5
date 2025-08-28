-- Create file sharing storage buckets and enhance chat system
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-files', 'chat-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-images', 'chat-images', true);

-- Create RLS policies for chat file storage
CREATE POLICY "Users can upload their own chat files" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'chat-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Conversation participants can view chat files" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'chat-files' AND 
  EXISTS (
    SELECT 1 FROM conversations c, messages m 
    WHERE c.id = m.conversation_id 
    AND m.attachment_url LIKE '%' || name 
    AND (c.client_id = auth.uid() OR c.vendor_id = auth.uid())
  )
);

CREATE POLICY "Users can upload chat images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'chat-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view chat images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'chat-images');

-- Enhanced message table with better file support
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES messages(id);

-- Add indexes for better chat performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created 
ON messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_created 
ON messages(sender_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_participants 
ON conversations(client_id, vendor_id);

-- Enhanced conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS archived_by UUID;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_read_client TIMESTAMP WITH TIME ZONE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS last_read_vendor TIMESTAMP WITH TIME ZONE;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_count_client INTEGER DEFAULT 0;
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS unread_count_vendor INTEGER DEFAULT 0;

-- Function to update conversation when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS trigger AS $$
BEGIN
  UPDATE conversations 
  SET 
    last_message = NEW.content,
    last_message_at = NEW.created_at,
    updated_at = NEW.created_at,
    unread_count_client = CASE 
      WHEN NEW.sender_id = client_id THEN unread_count_client 
      ELSE unread_count_client + 1 
    END,
    unread_count_vendor = CASE 
      WHEN NEW.sender_id = vendor_id THEN unread_count_vendor 
      ELSE unread_count_vendor + 1 
    END
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for conversation updates
DROP TRIGGER IF EXISTS trigger_update_conversation_on_message ON messages;
CREATE TRIGGER trigger_update_conversation_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_conversation_read(conversation_id UUID, user_id UUID)
RETURNS VOID AS $$
DECLARE
  conv_record RECORD;
BEGIN
  SELECT client_id, vendor_id INTO conv_record 
  FROM conversations WHERE id = conversation_id;
  
  IF conv_record.client_id = user_id THEN
    UPDATE conversations 
    SET 
      last_read_client = NOW(),
      unread_count_client = 0
    WHERE id = conversation_id;
  ELSIF conv_record.vendor_id = user_id THEN
    UPDATE conversations 
    SET 
      last_read_vendor = NOW(),
      unread_count_vendor = 0
    WHERE id = conversation_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Enhanced notification function for messages
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS trigger AS $$
DECLARE
  recipient_id UUID;
  sender_profile RECORD;
  conversation_record RECORD;
BEGIN
  -- Get conversation and sender details
  SELECT c.client_id, c.vendor_id, c.request_id, c.offer_id 
  INTO conversation_record
  FROM conversations c WHERE c.id = NEW.conversation_id;
  
  SELECT full_name, company_name 
  INTO sender_profile
  FROM user_profiles WHERE user_id = NEW.sender_id;
  
  -- Determine recipient
  recipient_id := CASE 
    WHEN NEW.sender_id = conversation_record.client_id 
    THEN conversation_record.vendor_id 
    ELSE conversation_record.client_id 
  END;
  
  -- Create notification
  INSERT INTO notifications (
    user_id,
    type,
    title,
    message,
    category,
    priority,
    data
  ) VALUES (
    recipient_id,
    'new_message',
    'New Message Received',
    'New message from ' || COALESCE(sender_profile.company_name, sender_profile.full_name, 'Someone'),
    'messages',
    'medium',
    json_build_object(
      'conversation_id', NEW.conversation_id,
      'message_id', NEW.id,
      'sender_id', NEW.sender_id,
      'request_id', conversation_record.request_id,
      'offer_id', conversation_record.offer_id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for message notifications
DROP TRIGGER IF EXISTS trigger_notify_new_message ON messages;
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();