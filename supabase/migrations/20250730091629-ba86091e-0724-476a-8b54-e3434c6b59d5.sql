-- Create table for expert consultation requests
CREATE TABLE public.expert_consultations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  event_type TEXT,
  event_date DATE,
  budget_range TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.expert_consultations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create consultation requests" 
ON public.expert_consultations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own consultation requests" 
ON public.expert_consultations 
FOR SELECT 
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can view all consultation requests" 
ON public.expert_consultations 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update consultation requests" 
ON public.expert_consultations 
FOR UPDATE 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_expert_consultations_updated_at
BEFORE UPDATE ON public.expert_consultations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();