-- Create requests table for service requests
CREATE TABLE public.requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  currency TEXT DEFAULT 'SAR',
  location TEXT,
  deadline DATE,
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create offers table for supplier offers
CREATE TABLE public.offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  currency TEXT DEFAULT 'SAR',
  delivery_time_days INTEGER NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'system', 'offer_update')) DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('new_offer', 'offer_accepted', 'offer_rejected', 'new_message', 'request_update')) NOT NULL,
  reference_id UUID, -- Can reference request_id, offer_id, etc.
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for requests table
CREATE POLICY "Users can view all requests" ON public.requests
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own requests" ON public.requests
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for offers table
CREATE POLICY "Users can view offers on their requests" ON public.offers
  FOR SELECT USING (
    auth.uid() = supplier_id OR 
    auth.uid() IN (SELECT user_id FROM public.requests WHERE id = request_id)
  );

CREATE POLICY "Suppliers can create offers" ON public.offers
  FOR INSERT WITH CHECK (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can update their own offers" ON public.offers
  FOR UPDATE USING (auth.uid() = supplier_id);

CREATE POLICY "Suppliers can delete their own offers" ON public.offers
  FOR DELETE USING (auth.uid() = supplier_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view their messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their sent messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- RLS Policies for notifications table
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_requests_user_id ON public.requests(user_id);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_requests_category ON public.requests(category);
CREATE INDEX idx_offers_request_id ON public.offers(request_id);
CREATE INDEX idx_offers_supplier_id ON public.offers(supplier_id);
CREATE INDEX idx_messages_sender_recipient ON public.messages(sender_id, recipient_id);
CREATE INDEX idx_messages_request_id ON public.messages(request_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(user_id, read_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();