-- Add missing indexes for better performance (corrected)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor_id ON public.conversations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON public.conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Add missing foreign key constraints for data integrity
ALTER TABLE public.notifications 
ADD CONSTRAINT fk_notifications_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT fk_messages_conversation_id 
FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;

ALTER TABLE public.messages 
ADD CONSTRAINT fk_messages_sender_id 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.conversations 
ADD CONSTRAINT fk_conversations_client_id 
FOREIGN KEY (client_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.conversations 
ADD CONSTRAINT fk_conversations_vendor_id 
FOREIGN KEY (vendor_id) REFERENCES auth.users(id) ON DELETE CASCADE;