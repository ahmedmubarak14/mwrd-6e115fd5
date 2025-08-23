-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('admin', 'client', 'vendor');

-- Create user status enum  
CREATE TYPE public.user_status AS ENUM ('pending', 'approved', 'blocked', 'rejected');

-- Create request status enum
CREATE TYPE public.request_status AS ENUM ('new', 'in_progress', 'completed', 'disputed', 'cancelled');

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'disputed');

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  role user_role NOT NULL DEFAULT 'client',
  status user_status NOT NULL DEFAULT 'pending',
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  bio TEXT,
  portfolio_url TEXT,
  verification_documents JSONB DEFAULT '[]',
  categories TEXT[] DEFAULT '{}',
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  vendor_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  urgency TEXT DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'new',
  admin_approval_status TEXT DEFAULT 'pending',
  location TEXT,
  deadline TIMESTAMPTZ,
  requirements JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE
);

-- Create orders table  
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  vendor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  delivery_date TIMESTAMPTZ,
  completion_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
  FOREIGN KEY (vendor_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  delivery_time INTEGER, -- in days
  status TEXT DEFAULT 'pending',
  client_approval_status TEXT DEFAULT 'pending',
  admin_approval_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (vendor_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium',
  read BOOLEAN DEFAULT FALSE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE
);

-- Create financial transactions table
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL, -- 'payment', 'refund', 'commission', etc.
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  payment_method TEXT,
  transaction_ref TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE CASCADE
);

-- Create expert consultations table
CREATE TABLE public.expert_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  event_type TEXT NOT NULL,
  event_description TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduled_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE SET NULL
);

-- Create audit log table
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES public.user_profiles(user_id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_profiles WHERE user_id = user_uuid;
$$;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for requests
CREATE POLICY "Users can view all requests" ON public.requests FOR SELECT USING (true);
CREATE POLICY "Clients can manage own requests" ON public.requests FOR ALL USING (auth.uid() = client_id);
CREATE POLICY "Admins can manage all requests" ON public.requests FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for orders
CREATE POLICY "Users can view related orders" ON public.orders FOR SELECT USING (auth.uid() = client_id OR auth.uid() = vendor_id OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Clients and vendors can update related orders" ON public.orders FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = vendor_id OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage all orders" ON public.orders FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for offers
CREATE POLICY "Users can view all offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Vendors can manage own offers" ON public.offers FOR ALL USING (auth.uid() = vendor_id);
CREATE POLICY "Admins can manage all offers" ON public.offers FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for financial_transactions
CREATE POLICY "Users can view own transactions" ON public.financial_transactions FOR SELECT USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Admins can manage all transactions" ON public.financial_transactions FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for expert_consultations
CREATE POLICY "Users can view own consultations" ON public.expert_consultations FOR SELECT USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can insert consultations" ON public.expert_consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all consultations" ON public.expert_consultations FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Create RLS policies for audit_log
CREATE POLICY "Admins can view audit log" ON public.audit_log FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "System can insert audit log" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expert_consultations_updated_at BEFORE UPDATE ON public.expert_consultations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();