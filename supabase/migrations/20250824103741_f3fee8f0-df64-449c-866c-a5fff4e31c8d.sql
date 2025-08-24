
-- Create vendor_profiles_extended table to store additional vendor information
CREATE TABLE public.vendor_profiles_extended (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  business_size TEXT,
  established_year INTEGER,
  employee_count TEXT,
  team_size TEXT,
  experience_years INTEGER,
  coverage_locations TEXT[] DEFAULT '{}',
  equipment TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(vendor_id)
);

-- Enable Row Level Security
ALTER TABLE public.vendor_profiles_extended ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Vendors can manage own extended profile" 
  ON public.vendor_profiles_extended 
  FOR ALL 
  USING (
    vendor_id IN (
      SELECT id FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'vendor'
    )
  );

CREATE POLICY "Anyone can view vendor extended profiles" 
  ON public.vendor_profiles_extended 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage all vendor extended profiles" 
  ON public.vendor_profiles_extended 
  FOR ALL 
  USING (get_user_role(auth.uid()) = 'admin');

-- Create trigger for updated_at
CREATE TRIGGER update_vendor_profiles_extended_updated_at
  BEFORE UPDATE ON public.vendor_profiles_extended
  FOR each ROW
  EXECUTE PROCEDURE public.update_updated_at_column();
