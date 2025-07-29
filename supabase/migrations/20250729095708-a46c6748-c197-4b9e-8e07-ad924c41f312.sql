-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add avatar_url column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN avatar_url TEXT;

-- Create admin policies to view all user profiles
CREATE POLICY "Admins can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);

-- Create admin policies to update any profile
CREATE POLICY "Admins can update any profile" 
ON public.user_profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);

-- Create admin policies to insert profiles
CREATE POLICY "Admins can insert any profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles admin_profile 
    WHERE admin_profile.id = auth.uid() 
    AND admin_profile.role = 'admin'
  )
);

-- Create function to get user statistics for admin dashboard
CREATE OR REPLACE FUNCTION public.get_user_statistics()
RETURNS TABLE (
  total_users BIGINT,
  total_clients BIGINT,
  total_suppliers BIGINT,
  total_admins BIGINT
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE role = 'client') as total_clients,
    COUNT(*) FILTER (WHERE role = 'supplier') as total_suppliers,
    COUNT(*) FILTER (WHERE role = 'admin') as total_admins
  FROM public.user_profiles;
END;
$$;