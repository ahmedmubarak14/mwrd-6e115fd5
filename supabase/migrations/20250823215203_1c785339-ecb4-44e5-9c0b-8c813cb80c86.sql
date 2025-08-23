-- Create projects table for grouping procurement requests
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'on_hold')),
  budget_total NUMERIC,
  currency TEXT DEFAULT 'SAR',
  start_date DATE,
  end_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT,
  location TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Clients can manage own projects" 
ON public.projects 
FOR ALL 
USING (auth.uid() = client_id);

CREATE POLICY "Admins can manage all projects" 
ON public.projects 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Vendors can view approved projects" 
ON public.projects 
FOR SELECT 
USING (status = 'active' OR get_user_role(auth.uid()) = 'admin'::user_role);

-- Create BOQ (Bill of Quantities) table
CREATE TABLE public.boq_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  item_code TEXT,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit_price NUMERIC,
  total_price NUMERIC GENERATED ALWAYS AS (quantity * COALESCE(unit_price, 0)) STORED,
  specifications JSONB DEFAULT '{}',
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'approved', 'ordered')),
  vendor_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for BOQ items
ALTER TABLE public.boq_items ENABLE ROW LEVEL SECURITY;

-- Create policies for BOQ items
CREATE POLICY "Project owners can manage BOQ items" 
ON public.boq_items 
FOR ALL 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE client_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all BOQ items" 
ON public.boq_items 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Vendors can view relevant BOQ items" 
ON public.boq_items 
FOR SELECT 
USING (
  category IN (
    SELECT UNNEST(categories) FROM public.user_profiles WHERE user_id = auth.uid()
  ) 
  OR vendor_id = auth.uid()
  OR get_user_role(auth.uid()) = 'admin'::user_role
);

-- Add project_id to requests table to link requests to projects
ALTER TABLE public.requests ADD COLUMN project_id UUID REFERENCES public.projects(id);

-- Create index for better performance
CREATE INDEX idx_requests_project_id ON public.requests(project_id);
CREATE INDEX idx_boq_items_project_id ON public.boq_items(project_id);
CREATE INDEX idx_boq_items_category ON public.boq_items(category);

-- Create trigger for updating updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boq_items_updated_at
  BEFORE UPDATE ON public.boq_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint for BOQ items project reference
ALTER TABLE public.boq_items ADD CONSTRAINT fk_boq_items_project 
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;