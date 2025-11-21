-- Create request_approval_history table for tracking approval workflows
CREATE TABLE IF NOT EXISTS public.request_approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('submitted', 'approved', 'rejected', 'changes_requested', 'resubmitted')),
  actor_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on request_approval_history
ALTER TABLE public.request_approval_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for request_approval_history
CREATE POLICY "Users can view approval history for their requests"
ON public.request_approval_history FOR SELECT
USING (
  request_id IN (
    SELECT id FROM public.requests WHERE client_id = auth.uid()
  )
  OR actor_id = auth.uid()
  OR get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "System can insert approval history"
ON public.request_approval_history FOR INSERT
WITH CHECK (true);

-- Create client_budget_settings table
CREATE TABLE IF NOT EXISTS public.client_budget_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL UNIQUE,
  monthly_budget NUMERIC NOT NULL DEFAULT 0,
  quarterly_budget NUMERIC NOT NULL DEFAULT 0,
  alert_threshold_80 BOOLEAN NOT NULL DEFAULT true,
  alert_threshold_100 BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on client_budget_settings
ALTER TABLE public.client_budget_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_budget_settings
CREATE POLICY "Clients can manage own budget settings"
ON public.client_budget_settings FOR ALL
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all budget settings"
ON public.client_budget_settings FOR SELECT
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create trigger for updated_at on client_budget_settings
CREATE TRIGGER update_client_budget_settings_updated_at
  BEFORE UPDATE ON public.client_budget_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function: get_pending_approvals_for_user
CREATE OR REPLACE FUNCTION public.get_pending_approvals_for_user(p_user_id UUID)
RETURNS TABLE (
  request_id UUID,
  title TEXT,
  description TEXT,
  budget NUMERIC,
  submitted_by UUID,
  submitter_name TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  category TEXT,
  urgency TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id as request_id,
    r.title,
    r.description,
    r.budget_max as budget,
    r.client_id as submitted_by,
    up.full_name as submitter_name,
    r.created_at as submitted_at,
    r.category,
    COALESCE(r.urgency, 'medium') as urgency
  FROM public.requests r
  JOIN public.user_profiles up ON r.client_id = up.user_id
  WHERE r.approval_status = 'pending'
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = p_user_id
    AND ur.role = 'admin'::app_role
  )
  ORDER BY 
    CASE r.urgency
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      ELSE 4
    END,
    r.created_at ASC;
END;
$$;

-- Function: approve_internal_request
CREATE OR REPLACE FUNCTION public.approve_internal_request(
  p_request_id UUID,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Check if user is admin
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Only admins can approve requests'
    );
  END IF;

  -- Update request status
  UPDATE public.requests
  SET 
    approval_status = 'approved',
    status = 'new',
    updated_at = now()
  WHERE id = p_request_id;

  -- Insert approval history
  INSERT INTO public.request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'approved', auth.uid(), p_notes);

  RETURN json_build_object(
    'success', true,
    'message', 'Request approved successfully'
  );
END;
$$;

-- Function: reject_internal_request
CREATE OR REPLACE FUNCTION public.reject_internal_request(
  p_request_id UUID,
  p_notes TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Only admins can reject requests'
    );
  END IF;

  -- Validate notes provided
  IF p_notes IS NULL OR p_notes = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Rejection reason is required'
    );
  END IF;

  -- Update request status
  UPDATE public.requests
  SET 
    approval_status = 'rejected',
    status = 'cancelled',
    updated_at = now()
  WHERE id = p_request_id;

  -- Insert approval history
  INSERT INTO public.request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'rejected', auth.uid(), p_notes);

  RETURN json_build_object(
    'success', true,
    'message', 'Request rejected'
  );
END;
$$;

-- Function: request_changes_internal_request
CREATE OR REPLACE FUNCTION public.request_changes_internal_request(
  p_request_id UUID,
  p_notes TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF get_user_role(auth.uid()) != 'admin'::user_role THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Only admins can request changes'
    );
  END IF;

  -- Validate notes provided
  IF p_notes IS NULL OR p_notes = '' THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Change details are required'
    );
  END IF;

  -- Update request status
  UPDATE public.requests
  SET 
    approval_status = 'changes_requested',
    updated_at = now()
  WHERE id = p_request_id;

  -- Insert approval history
  INSERT INTO public.request_approval_history (request_id, action, actor_id, notes)
  VALUES (p_request_id, 'changes_requested', auth.uid(), p_notes);

  RETURN json_build_object(
    'success', true,
    'message', 'Changes requested'
  );
END;
$$;

-- Function: get_client_spending_by_period
CREATE OR REPLACE FUNCTION public.get_client_spending_by_period(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  period TEXT,
  total_spent NUMERIC,
  order_count BIGINT,
  avg_order_value NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH period_data AS (
    SELECT 
      CASE 
        WHEN p_timeframe = 'month' THEN to_char(o.created_at, 'YYYY-MM')
        WHEN p_timeframe = 'quarter' THEN to_char(o.created_at, 'YYYY-Q')
        ELSE to_char(o.created_at, 'YYYY')
      END as period_key,
      o.amount
    FROM public.orders o
    WHERE o.client_id = p_client_id
    AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    AND o.created_at >= CASE 
      WHEN p_timeframe = 'month' THEN now() - INTERVAL '12 months'
      WHEN p_timeframe = 'quarter' THEN now() - INTERVAL '4 quarters'
      ELSE now() - INTERVAL '5 years'
    END
  )
  SELECT 
    period_key::TEXT as period,
    COALESCE(SUM(amount), 0) as total_spent,
    COUNT(*)::BIGINT as order_count,
    COALESCE(AVG(amount), 0) as avg_order_value
  FROM period_data
  GROUP BY period_key
  ORDER BY period_key DESC;
END;
$$;

-- Function: get_client_spending_by_vendor
CREATE OR REPLACE FUNCTION public.get_client_spending_by_vendor(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  vendor_id UUID,
  vendor_name TEXT,
  total_spent NUMERIC,
  order_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.vendor_id,
    COALESCE(up.company_name, up.full_name, 'Unknown Vendor') as vendor_name,
    COALESCE(SUM(o.amount), 0) as total_spent,
    COUNT(*)::BIGINT as order_count
  FROM public.orders o
  LEFT JOIN public.user_profiles up ON o.vendor_id = up.user_id
  WHERE o.client_id = p_client_id
  AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
  AND o.created_at >= CASE 
    WHEN p_timeframe = 'month' THEN now() - INTERVAL '1 month'
    WHEN p_timeframe = 'quarter' THEN now() - INTERVAL '3 months'
    ELSE now() - INTERVAL '1 year'
  END
  GROUP BY o.vendor_id, up.company_name, up.full_name
  ORDER BY total_spent DESC
  LIMIT 10;
END;
$$;

-- Function: get_client_spending_by_category
CREATE OR REPLACE FUNCTION public.get_client_spending_by_category(
  p_client_id UUID,
  p_timeframe TEXT DEFAULT 'month'
)
RETURNS TABLE (
  category TEXT,
  total_spent NUMERIC,
  percentage NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH category_spending AS (
    SELECT 
      r.category,
      COALESCE(SUM(o.amount), 0) as spent
    FROM public.orders o
    JOIN public.requests r ON o.request_id = r.id
    WHERE o.client_id = p_client_id
    AND o.status IN ('confirmed', 'processing', 'shipped', 'delivered')
    AND o.created_at >= CASE 
      WHEN p_timeframe = 'month' THEN now() - INTERVAL '1 month'
      WHEN p_timeframe = 'quarter' THEN now() - INTERVAL '3 months'
      ELSE now() - INTERVAL '1 year'
    END
    GROUP BY r.category
  ),
  total_spending AS (
    SELECT COALESCE(SUM(spent), 0) as total FROM category_spending
  )
  SELECT 
    cs.category::TEXT,
    cs.spent as total_spent,
    CASE 
      WHEN ts.total > 0 THEN (cs.spent / ts.total * 100)
      ELSE 0
    END as percentage
  FROM category_spending cs
  CROSS JOIN total_spending ts
  ORDER BY cs.spent DESC;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_request_approval_history_request_id 
  ON public.request_approval_history(request_id);
CREATE INDEX IF NOT EXISTS idx_request_approval_history_actor_id 
  ON public.request_approval_history(actor_id);
CREATE INDEX IF NOT EXISTS idx_client_budget_settings_client_id 
  ON public.client_budget_settings(client_id);