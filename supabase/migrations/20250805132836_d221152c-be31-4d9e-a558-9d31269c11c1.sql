-- Enhance the messages table structure for real-time chat
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS conversation_id UUID,
ADD COLUMN IF NOT EXISTS message_status TEXT DEFAULT 'sent' CHECK (message_status IN ('sent', 'delivered', 'read')),
ADD COLUMN IF NOT EXISTS reply_to_id UUID REFERENCES public.messages(id),
ADD COLUMN IF NOT EXISTS attachment_url TEXT,
ADD COLUMN IF NOT EXISTS attachment_type TEXT;

-- Create conversations table to manage chat sessions
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id),
  offer_id UUID REFERENCES public.offers(id),
  client_id UUID NOT NULL,
  supplier_id UUID NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Users can view their conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = supplier_id);

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (auth.uid() = client_id OR auth.uid() = supplier_id);

CREATE POLICY "Users can update their conversations" 
ON public.conversations 
FOR UPDATE 
USING (auth.uid() = client_id OR auth.uid() = supplier_id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON public.conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_supplier_id ON public.conversations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_conversations_request_id ON public.conversations(request_id);
CREATE INDEX IF NOT EXISTS idx_conversations_offer_id ON public.conversations(offer_id);

-- Update messages table to reference conversations
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);

-- Create trigger to update conversation last_message_at
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_last_message_trigger
AFTER INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_last_message();

-- Create function to start a conversation
CREATE OR REPLACE FUNCTION public.start_conversation(
  p_request_id UUID DEFAULT NULL,
  p_offer_id UUID DEFAULT NULL,
  p_client_id UUID,
  p_supplier_id UUID
)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Check if conversation already exists
  SELECT id INTO conversation_id
  FROM public.conversations
  WHERE (request_id = p_request_id OR p_request_id IS NULL)
    AND (offer_id = p_offer_id OR p_offer_id IS NULL)
    AND client_id = p_client_id
    AND supplier_id = p_supplier_id;
  
  -- Create new conversation if not exists
  IF conversation_id IS NULL THEN
    INSERT INTO public.conversations (request_id, offer_id, client_id, supplier_id)
    VALUES (p_request_id, p_offer_id, p_client_id, p_supplier_id)
    RETURNING id INTO conversation_id;
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;