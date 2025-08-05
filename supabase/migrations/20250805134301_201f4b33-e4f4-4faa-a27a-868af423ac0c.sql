-- Create sample conversations and messages for testing
DO $$
DECLARE
    client_id UUID := 'f841e31e-c3df-4167-824a-41e7942ec309'; -- Ahmed Mubarak (client)
    supplier_id UUID := '7e3d1ced-623a-4832-8fec-c27fbe2d67df'; -- Ahmed (Supplier)
    conversation_id UUID;
    message_id UUID;
BEGIN
    -- Create a conversation between client and supplier
    INSERT INTO public.conversations (client_id, supplier_id, status, last_message_at)
    VALUES (client_id, supplier_id, 'active', now())
    RETURNING id INTO conversation_id;
    
    -- Create initial message from client
    INSERT INTO public.messages (
        conversation_id, 
        sender_id, 
        recipient_id, 
        content, 
        message_type, 
        message_status,
        created_at
    ) VALUES (
        conversation_id,
        client_id,
        supplier_id,
        'Hello, I saw your company profile and I''m interested in your services for an upcoming event. Could we discuss the details?',
        'text',
        'delivered',
        now() - interval '2 hours'
    );
    
    -- Create response from supplier
    INSERT INTO public.messages (
        conversation_id, 
        sender_id, 
        recipient_id, 
        content, 
        message_type, 
        message_status,
        created_at
    ) VALUES (
        conversation_id,
        supplier_id,
        client_id,
        'Hello! Thank you for your interest. I''d be happy to discuss your event requirements. What type of event are you planning and what services do you need?',
        'text',
        'delivered',
        now() - interval '1 hour'
    );
    
    -- Create follow-up from client
    INSERT INTO public.messages (
        conversation_id, 
        sender_id, 
        recipient_id, 
        content, 
        message_type, 
        message_status,
        created_at
    ) VALUES (
        conversation_id,
        client_id,
        supplier_id,
        'We''re planning a corporate conference for 200 attendees next month. We need AVL equipment, booth design, and catering services. What packages do you offer?',
        'text',
        'sent',
        now() - interval '30 minutes'
    );
    
    -- Update conversation last_message_at
    UPDATE public.conversations 
    SET last_message_at = now() - interval '30 minutes'
    WHERE id = conversation_id;
    
    RAISE NOTICE 'Sample conversation and messages created successfully';
END $$;