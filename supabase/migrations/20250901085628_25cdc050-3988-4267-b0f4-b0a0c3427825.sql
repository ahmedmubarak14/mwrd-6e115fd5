-- Create vendor projects table for CR-focused project showcases
CREATE TABLE public.vendor_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  subcategory TEXT,
  project_type TEXT DEFAULT 'commercial', -- 'commercial', 'government', 'private'
  start_date DATE,
  end_date DATE,
  project_value NUMERIC,
  currency TEXT DEFAULT 'SAR',
  location TEXT,
  client_name TEXT,
  client_type TEXT, -- 'government', 'private_company', 'individual'
  project_status TEXT DEFAULT 'completed', -- 'completed', 'ongoing', 'cancelled'
  visibility_level TEXT DEFAULT 'public', -- 'public', 'private', 'confidential'
  cr_reference TEXT, -- Link to commercial registration
  contract_value NUMERIC,
  project_scope TEXT,
  technologies_used JSONB DEFAULT '[]'::jsonb,
  certifications_earned JSONB DEFAULT '[]'::jsonb,
  client_testimonial TEXT,
  project_metrics JSONB DEFAULT '{}'::jsonb,
  completion_certificate_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor project media table for project images/documents
CREATE TABLE public.vendor_project_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL,
  media_type TEXT NOT NULL, -- 'image', 'document', 'video', 'certificate'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enhance vendor_profiles_extended for CR-focused metrics
ALTER TABLE public.vendor_profiles_extended 
ADD COLUMN IF NOT EXISTS cr_number TEXT,
ADD COLUMN IF NOT EXISTS cr_expiry_date DATE,
ADD COLUMN IF NOT EXISTS cr_document_url TEXT,
ADD COLUMN IF NOT EXISTS business_license_url TEXT,
ADD COLUMN IF NOT EXISTS specializations JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS service_areas JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS years_in_business INTEGER,
ADD COLUMN IF NOT EXISTS employee_count INTEGER,
ADD COLUMN IF NOT EXISTS annual_revenue_range TEXT,
ADD COLUMN IF NOT EXISTS quality_certifications JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_completion_rate NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_project_value NUMERIC,
ADD COLUMN IF NOT EXISTS client_satisfaction_score NUMERIC,
ADD COLUMN IF NOT EXISTS repeat_client_rate NUMERIC,
ADD COLUMN IF NOT EXISTS on_time_delivery_rate NUMERIC,
ADD COLUMN IF NOT EXISTS cr_verification_status TEXT DEFAULT 'unverified';

-- Create vendor categories junction table
CREATE TABLE IF NOT EXISTS public.vendor_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  category_id UUID NOT NULL,
  specialization_level TEXT DEFAULT 'general', -- 'general', 'specialized', 'expert'
  years_experience INTEGER,
  certification_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id, category_id)
);

-- Enable RLS on new tables
ALTER TABLE public.vendor_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendor_projects
CREATE POLICY "Vendors can manage own projects" 
ON public.vendor_projects 
FOR ALL 
USING (vendor_id = auth.uid());

CREATE POLICY "Public projects visible to verified clients" 
ON public.vendor_projects 
FOR SELECT 
USING (
  visibility_level = 'public' AND 
  vendor_id IN (
    SELECT user_id FROM user_profiles 
    WHERE verification_status = 'approved' AND role = 'vendor'
  )
);

CREATE POLICY "Admins can view all projects" 
ON public.vendor_projects 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for vendor_project_media
CREATE POLICY "Project media follows project access" 
ON public.vendor_project_media 
FOR SELECT 
USING (
  project_id IN (
    SELECT id FROM vendor_projects 
    WHERE (vendor_id = auth.uid()) OR 
          (visibility_level = 'public' AND vendor_id IN (
            SELECT user_id FROM user_profiles 
            WHERE verification_status = 'approved' AND role = 'vendor'
          )) OR
          (get_user_role(auth.uid()) = 'admin')
  )
);

CREATE POLICY "Vendors can manage own project media" 
ON public.vendor_project_media 
FOR ALL 
USING (
  project_id IN (
    SELECT id FROM vendor_projects WHERE vendor_id = auth.uid()
  )
);

-- Create RLS policies for vendor_categories
CREATE POLICY "Vendors can manage own categories" 
ON public.vendor_categories 
FOR ALL 
USING (vendor_id = auth.uid());

CREATE POLICY "Anyone can view approved vendor categories" 
ON public.vendor_categories 
FOR SELECT 
USING (
  vendor_id IN (
    SELECT user_id FROM user_profiles 
    WHERE verification_status = 'approved' AND role = 'vendor'
  ) OR 
  get_user_role(auth.uid()) = 'admin'
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_vendor_projects_updated_at
BEFORE UPDATE ON public.vendor_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.vendor_projects 
ADD CONSTRAINT fk_vendor_projects_vendor 
FOREIGN KEY (vendor_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.vendor_project_media 
ADD CONSTRAINT fk_vendor_project_media_project 
FOREIGN KEY (project_id) REFERENCES public.vendor_projects(id) ON DELETE CASCADE;

ALTER TABLE public.vendor_categories 
ADD CONSTRAINT fk_vendor_categories_vendor 
FOREIGN KEY (vendor_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.vendor_categories 
ADD CONSTRAINT fk_vendor_categories_category 
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;