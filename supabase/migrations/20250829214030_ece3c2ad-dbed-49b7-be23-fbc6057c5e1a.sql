-- Create workflow_rules table for automation system
CREATE TABLE public.workflow_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- 'request_created', 'offer_submitted', 'user_registered', etc.
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  priority INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'draft'
  created_by UUID NOT NULL,
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_executions table for tracking
CREATE TABLE public.workflow_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_rule_id UUID NOT NULL,
  trigger_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  execution_result JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'executing', 'completed', 'failed'
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approval_workflows table
CREATE TABLE public.approval_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL, -- 'request', 'offer', 'user_verification', etc.
  entity_id UUID NOT NULL,
  workflow_name TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 1,
  total_steps INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'escalated'
  assigned_to UUID,
  approver_notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_by UUID,
  rejected_at TIMESTAMP WITH TIME ZONE,
  escalated_to UUID,
  escalated_at TIMESTAMP WITH TIME ZONE,
  deadline TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_performance_metrics table
CREATE TABLE public.vendor_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  category TEXT,
  response_time_avg_hours DECIMAL(10,2) DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0,
  total_completed_orders INTEGER DEFAULT 0,
  total_earnings DECIMAL(15,2) DEFAULT 0,
  customer_satisfaction DECIMAL(3,2) DEFAULT 0,
  on_time_delivery_rate DECIMAL(5,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, category)
);

-- Enable RLS on all tables
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflow_rules
CREATE POLICY "Admins can manage workflow rules" 
ON public.workflow_rules 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS Policies for workflow_executions
CREATE POLICY "Admins can view workflow executions" 
ON public.workflow_executions 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "System can insert workflow executions" 
ON public.workflow_executions 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for approval_workflows
CREATE POLICY "Admins can manage all approval workflows" 
ON public.approval_workflows 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Users can view workflows for their entities" 
ON public.approval_workflows 
FOR SELECT 
USING (
  (entity_type = 'request' AND entity_id IN (SELECT id FROM requests WHERE client_id = auth.uid())) OR
  (entity_type = 'offer' AND entity_id IN (SELECT id FROM offers WHERE vendor_id = auth.uid())) OR
  (entity_type = 'user_verification' AND entity_id = auth.uid()) OR
  (get_user_role(auth.uid()) = 'admin'::user_role)
);

-- RLS Policies for vendor_performance_metrics
CREATE POLICY "Vendors can view own performance metrics" 
ON public.vendor_performance_metrics 
FOR SELECT 
USING (vendor_id = auth.uid() OR get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Admins can manage all performance metrics" 
ON public.vendor_performance_metrics 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Foreign keys
ALTER TABLE public.workflow_executions 
ADD CONSTRAINT workflow_executions_workflow_rule_id_fkey 
FOREIGN KEY (workflow_rule_id) REFERENCES public.workflow_rules(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_workflow_rules_trigger_type ON public.workflow_rules(trigger_type);
CREATE INDEX idx_workflow_rules_status ON public.workflow_rules(status);
CREATE INDEX idx_workflow_executions_workflow_rule_id ON public.workflow_executions(workflow_rule_id);
CREATE INDEX idx_workflow_executions_status ON public.workflow_executions(status);
CREATE INDEX idx_approval_workflows_entity ON public.approval_workflows(entity_type, entity_id);
CREATE INDEX idx_approval_workflows_status ON public.approval_workflows(status);
CREATE INDEX idx_approval_workflows_assigned_to ON public.approval_workflows(assigned_to);
CREATE INDEX idx_vendor_performance_vendor_id ON public.vendor_performance_metrics(vendor_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_workflow_rules_updated_at
    BEFORE UPDATE ON public.workflow_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_approval_workflows_updated_at
    BEFORE UPDATE ON public.approval_workflows
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();