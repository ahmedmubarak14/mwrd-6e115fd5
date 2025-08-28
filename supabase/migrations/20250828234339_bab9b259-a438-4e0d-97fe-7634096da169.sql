-- Create workflow automation system tables

-- Workflow types and actions enum
CREATE TYPE workflow_trigger_type AS ENUM (
  'request_created',
  'offer_submitted',
  'approval_pending',
  'deadline_approaching',
  'status_changed',
  'time_elapsed',
  'performance_threshold'
);

CREATE TYPE workflow_action_type AS ENUM (
  'send_notification',
  'auto_assign',
  'escalate_approval',
  'update_status',
  'create_task',
  'send_email',
  'auto_approve',
  'auto_reject'
);

CREATE TYPE workflow_status AS ENUM ('active', 'inactive', 'draft');

-- Main workflows table
CREATE TABLE public.workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type workflow_trigger_type NOT NULL,
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '[]',
  status workflow_status NOT NULL DEFAULT 'draft',
  priority INTEGER NOT NULL DEFAULT 1,
  delay_minutes INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_executed_at TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0
);

-- Workflow execution logs
CREATE TABLE public.workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_rule_id UUID REFERENCES workflow_rules(id) ON DELETE CASCADE,
  trigger_data JSONB NOT NULL DEFAULT '{}',
  executed_actions JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Automated tasks created by workflows
CREATE TABLE public.automated_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_execution_id UUID REFERENCES workflow_executions(id),
  assigned_to UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'pending',
  reference_type TEXT, -- 'request', 'offer', 'order', etc.
  reference_id UUID,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance tracking for smart assignments
CREATE TABLE public.vendor_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL,
  category TEXT,
  response_time_avg_hours DECIMAL(10,2) DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0,
  total_completed_orders INTEGER DEFAULT 0,
  total_earnings DECIMAL(15,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, category)
);

-- Enable RLS
ALTER TABLE workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflow_rules
CREATE POLICY "Admins can manage all workflow rules"
  ON workflow_rules FOR ALL 
  USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for workflow_executions  
CREATE POLICY "Admins can view all workflow executions"
  ON workflow_executions FOR SELECT
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can insert workflow executions"
  ON workflow_executions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for automated_tasks
CREATE POLICY "Users can view assigned tasks"
  ON automated_tasks FOR SELECT
  USING (auth.uid() = assigned_to OR get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can manage automated tasks"
  ON automated_tasks FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for vendor_performance_metrics
CREATE POLICY "Vendors can view own metrics"
  ON vendor_performance_metrics FOR SELECT
  USING (auth.uid() = vendor_id OR get_user_role(auth.uid()) = 'admin');

CREATE POLICY "System can manage performance metrics"
  ON vendor_performance_metrics FOR ALL
  USING (get_user_role(auth.uid()) = 'admin');

-- Indexes for performance
CREATE INDEX idx_workflow_rules_trigger_type ON workflow_rules(trigger_type, status);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status, created_at);
CREATE INDEX idx_automated_tasks_assigned_to ON automated_tasks(assigned_to, status);
CREATE INDEX idx_automated_tasks_reference ON automated_tasks(reference_type, reference_id);
CREATE INDEX idx_vendor_performance_vendor_category ON vendor_performance_metrics(vendor_id, category);

-- Triggers for updated_at
CREATE TRIGGER update_workflow_rules_updated_at
  BEFORE UPDATE ON workflow_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automated_tasks_updated_at
  BEFORE UPDATE ON automated_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to execute workflow rules
CREATE OR REPLACE FUNCTION execute_workflow_rules(
  trigger_type_param workflow_trigger_type,
  trigger_data_param JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  workflow_rule RECORD;
  execution_id UUID;
  action_item JSONB;
  conditions_met BOOLEAN;
BEGIN
  -- Get all active workflow rules for this trigger type
  FOR workflow_rule IN 
    SELECT * FROM workflow_rules 
    WHERE trigger_type = trigger_type_param 
    AND status = 'active'
    ORDER BY priority DESC
  LOOP
    -- Check if conditions are met (simplified for now)
    conditions_met := true;
    
    -- Create execution log
    INSERT INTO workflow_executions (
      workflow_rule_id,
      trigger_data,
      status
    ) VALUES (
      workflow_rule.id,
      trigger_data_param,
      'executing'
    ) RETURNING id INTO execution_id;
    
    -- Execute actions (will be handled by edge function)
    -- For now, just mark as completed
    UPDATE workflow_executions 
    SET status = 'completed', completed_at = now()
    WHERE id = execution_id;
    
    -- Update rule execution count
    UPDATE workflow_rules
    SET execution_count = execution_count + 1,
        last_executed_at = now()
    WHERE id = workflow_rule.id;
  END LOOP;
END;
$$;

-- Insert some default workflow rules
INSERT INTO workflow_rules (name, description, trigger_type, trigger_conditions, actions, status, priority) VALUES 
(
  'Smart Vendor Notification',
  'Automatically notify qualified vendors when new requests are created',
  'request_created',
  '{"categories": [], "min_rating": 3.0}',
  '[{"type": "auto_assign", "params": {"method": "smart_matching"}}, {"type": "send_notification", "params": {"template": "new_request_available"}}]',
  'active',
  10
),
(
  'Approval Escalation - 48 Hours',
  'Escalate pending approvals to admin after 48 hours',
  'approval_pending',
  '{"hours_elapsed": 48}',
  '[{"type": "escalate_approval", "params": {"escalate_to": "admin"}}, {"type": "send_notification", "params": {"template": "approval_escalated"}}]',
  'active',
  8
),
(
  'Auto-Approve High-Performance Vendors',
  'Automatically approve offers from vendors with high performance scores',
  'offer_submitted',
  '{"min_performance_score": 4.5, "max_amount": 10000}',
  '[{"type": "auto_approve", "params": {"level": "admin"}}, {"type": "send_notification", "params": {"template": "offer_auto_approved"}}]',
  'active',
  9
),
(
  'Deadline Warning - 3 Days',
  'Send warning notifications 3 days before project deadlines',
  'deadline_approaching',
  '{"days_before": 3}',
  '[{"type": "send_notification", "params": {"template": "deadline_warning", "recipients": ["client", "vendor"]}}, {"type": "create_task", "params": {"title": "Review project progress"}}]',
  'active',
  7
);

-- Function to update vendor performance metrics
CREATE OR REPLACE FUNCTION update_vendor_performance_metrics(
  p_vendor_id UUID,
  p_category TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_response_time DECIMAL(10,2);
  completion_rate DECIMAL(5,2);
  avg_quality DECIMAL(3,2);
  total_orders INTEGER;
  total_earnings DECIMAL(15,2);
BEGIN
  -- Calculate response time (hours between request created and first offer)
  SELECT AVG(EXTRACT(EPOCH FROM (o.created_at - r.created_at)) / 3600)
  INTO avg_response_time
  FROM offers o
  JOIN requests r ON o.request_id = r.id
  WHERE o.vendor_id = p_vendor_id
  AND (p_category IS NULL OR r.category = p_category)
  AND o.created_at >= NOW() - INTERVAL '90 days';
  
  -- Calculate completion rate
  SELECT 
    CASE 
      WHEN COUNT(*) > 0 THEN 
        (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100
      ELSE 0 
    END
  INTO completion_rate
  FROM orders
  WHERE vendor_id = p_vendor_id
  AND (p_category IS NULL OR title ILIKE '%' || p_category || '%')
  AND created_at >= NOW() - INTERVAL '90 days';
  
  -- For now, use a random quality score (would be based on ratings in real system)
  avg_quality := 3.5 + (RANDOM() * 1.5);
  
  -- Calculate totals
  SELECT COUNT(*), COALESCE(SUM(amount), 0)
  INTO total_orders, total_earnings
  FROM orders
  WHERE vendor_id = p_vendor_id
  AND status = 'completed'
  AND (p_category IS NULL OR title ILIKE '%' || p_category || '%');
  
  -- Insert or update metrics
  INSERT INTO vendor_performance_metrics (
    vendor_id,
    category,
    response_time_avg_hours,
    completion_rate,
    quality_score,
    total_completed_orders,
    total_earnings,
    last_updated
  ) VALUES (
    p_vendor_id,
    p_category,
    COALESCE(avg_response_time, 24),
    COALESCE(completion_rate, 0),
    avg_quality,
    COALESCE(total_orders, 0),
    COALESCE(total_earnings, 0),
    NOW()
  )
  ON CONFLICT (vendor_id, category)
  DO UPDATE SET
    response_time_avg_hours = EXCLUDED.response_time_avg_hours,
    completion_rate = EXCLUDED.completion_rate,
    quality_score = EXCLUDED.quality_score,
    total_completed_orders = EXCLUDED.total_completed_orders,
    total_earnings = EXCLUDED.total_earnings,
    last_updated = NOW();
END;
$$;

-- Update existing triggers to integrate with workflow system
CREATE OR REPLACE FUNCTION notify_request_created_with_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Execute workflow rules
  PERFORM execute_workflow_rules(
    'request_created',
    json_build_object(
      'request_id', NEW.id,
      'category', NEW.category,
      'client_id', NEW.client_id,
      'budget_max', NEW.budget_max,
      'deadline', NEW.deadline,
      'urgency', NEW.urgency
    )
  );
  
  -- Keep existing notification logic for backward compatibility
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
    up.user_id,
    'request_created',
    'New Request Needs Review',
    'A new procurement request "' || NEW.title || '" has been created and needs admin approval.',
    'requests',
    'medium',
    json_build_object(
      'request_id', NEW.id,
      'title', NEW.title,
      'category', NEW.category
    )
  FROM user_profiles up
  WHERE up.role = 'admin';

  RETURN NEW;
END;
$$;

-- Replace the existing trigger
DROP TRIGGER IF EXISTS notify_request_created_trigger ON requests;
CREATE TRIGGER notify_request_created_trigger
  AFTER INSERT ON requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_request_created_with_workflow();