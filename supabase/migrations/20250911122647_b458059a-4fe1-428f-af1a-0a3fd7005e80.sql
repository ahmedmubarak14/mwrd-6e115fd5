-- Add bank account fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN bank_name text,
ADD COLUMN bank_account_number text,
ADD COLUMN iban text;

-- Add client-specific industry preferences
ALTER TABLE public.user_profiles 
ADD COLUMN industry_preferences text[];

-- Create client_profiles_extended table for additional client data
CREATE TABLE public.client_profiles_extended (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  budget_range text,
  procurement_frequency text,
  preferred_vendors text[],
  business_requirements jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on client_profiles_extended
ALTER TABLE public.client_profiles_extended ENABLE ROW LEVEL SECURITY;

-- Create policies for client_profiles_extended
CREATE POLICY "Clients can manage their own extended profile" 
ON public.client_profiles_extended 
FOR ALL 
USING (
  client_id IN (
    SELECT user_profiles.id 
    FROM user_profiles 
    WHERE user_profiles.user_id = auth.uid() 
    AND user_profiles.role = 'client'
  )
  OR get_user_role(auth.uid()) = 'admin'::user_role
);

-- Add trigger for updated_at on client_profiles_extended
CREATE TRIGGER update_client_profiles_extended_updated_at
BEFORE UPDATE ON public.client_profiles_extended
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();