-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations 
  SET last_message_at = NEW.created_at, updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.start_conversation(
  p_request_id UUID,
  p_offer_id UUID,
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;