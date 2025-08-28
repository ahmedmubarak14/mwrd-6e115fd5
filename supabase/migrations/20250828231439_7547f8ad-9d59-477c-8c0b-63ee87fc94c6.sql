-- Fix remaining function search path issues

-- Fix all functions that don't have search_path set properly
CREATE OR REPLACE FUNCTION public.create_order_from_accepted_offer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Only create order if client approval status changed to 'approved'
  IF NEW.client_approval_status = 'approved' AND OLD.client_approval_status != 'approved' THEN
    INSERT INTO orders (
      id,
      offer_id,
      request_id,
      client_id,
      vendor_id,
      title,
      description,
      amount,
      currency,
      status,
      delivery_date,
      created_at,
      updated_at
    )
    SELECT 
      gen_random_uuid(),
      NEW.id,
      NEW.request_id,
      r.client_id,
      NEW.vendor_id,
      COALESCE(NEW.title, r.title),
      COALESCE(NEW.description, r.description),
      NEW.price,
      COALESCE(NEW.currency, 'SAR'),
      'pending'::order_status,
      CASE 
        WHEN NEW.delivery_time_days IS NOT NULL THEN 
          NOW() + (NEW.delivery_time_days || ' days')::INTERVAL
        ELSE NULL
      END,
      NOW(),
      NOW()
    FROM requests r
    WHERE r.id = NEW.request_id;
    
    -- Update offer approval date
    NEW.client_approval_date = NOW();
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_offer_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Notify client when offer status changes
  IF NEW.client_approval_status != OLD.client_approval_status THEN
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      category,
      priority,
      data
    )
    SELECT 
      r.client_id,
      'offer_status_update',
      'Offer Status Updated',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'Your offer has been approved and an order has been created.'
        WHEN NEW.client_approval_status = 'rejected' THEN 'Your offer has been rejected.'
        ELSE 'Your offer status has been updated to ' || NEW.client_approval_status
      END,
      'offers',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'high'
        ELSE 'medium'
      END,
      json_build_object(
        'offer_id', NEW.id,
        'request_id', NEW.request_id,
        'new_status', NEW.client_approval_status,
        'old_status', OLD.client_approval_status
      )
    FROM requests r
    WHERE r.id = NEW.request_id;

    -- Notify vendor about status change
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message,
      category,
      priority,
      data
    )
    VALUES (
      NEW.vendor_id,
      'offer_status_update',
      'Offer Status Updated',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'Your offer has been approved by the client!'
        WHEN NEW.client_approval_status = 'rejected' THEN 'Your offer has been rejected by the client.'
        ELSE 'Your offer status has been updated to ' || NEW.client_approval_status
      END,
      'offers',
      CASE 
        WHEN NEW.client_approval_status = 'approved' THEN 'high'
        ELSE 'medium'
      END,
      json_build_object(
        'offer_id', NEW.id,
        'request_id', NEW.request_id,
        'new_status', NEW.client_approval_status,
        'old_status', OLD.client_approval_status
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_sensitive_operation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    created_at
  )
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    now()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_verification_approval()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE user_profiles 
    SET 
      verification_status = 'approved',
      verified_at = NEW.reviewed_at,
      verified_by = NEW.reviewed_by,
      status = 'approved'
    WHERE user_id = NEW.user_id;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE user_profiles 
    SET 
      verification_status = 'rejected',
      verification_notes = NEW.reviewer_notes
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_admin_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log profile changes for audit trail
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (
      user_id,
      action,
      entity_type,
      entity_id,
      old_values,
      new_values,
      created_at
    )
    VALUES (
      auth.uid(),
      'profile_update',
      'user_profiles',
      NEW.id,
      row_to_json(OLD),
      row_to_json(NEW),
      now()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_document_access_attempt(file_path text, user_role text, success boolean, error_message text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;