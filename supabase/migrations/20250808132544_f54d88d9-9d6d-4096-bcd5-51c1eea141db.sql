-- Create activity_feed table for tracking user activities
CREATE TABLE public.activity_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('request_created', 'offer_submitted', 'offer_accepted', 'offer_rejected', 'profile_updated', 'message_sent', 'search_performed')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  entity_type TEXT CHECK (entity_type IN ('request', 'offer', 'message', 'profile', 'search')),
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Create policies for activity feed access
CREATE POLICY "Users can view their own activities" 
ON public.activity_feed 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.activity_feed 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_activity_feed_user_id_created_at ON public.activity_feed(user_id, created_at DESC);
CREATE INDEX idx_activity_feed_entity ON public.activity_feed(entity_type, entity_id);

-- Enable real-time for activity feed
ALTER TABLE public.activity_feed REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_feed;