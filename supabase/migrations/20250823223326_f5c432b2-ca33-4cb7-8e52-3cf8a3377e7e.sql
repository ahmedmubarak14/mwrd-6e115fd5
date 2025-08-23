-- Create video_calls table for call history and management
CREATE TABLE public.video_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id UUID NOT NULL,
  callee_id UUID NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id),
  status TEXT NOT NULL DEFAULT 'initiated', -- initiated, ringing, active, ended, missed, declined
  call_type TEXT NOT NULL DEFAULT 'video', -- video, audio
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  answered_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  quality_score NUMERIC, -- 1-5 rating for call quality
  recording_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create call_invitations table for managing call invitations
CREATE TABLE public.call_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.video_calls(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL,
  invitee_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, expired
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '2 minutes'),
  response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.video_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for video_calls
CREATE POLICY "Users can view calls they participated in" 
ON public.video_calls 
FOR SELECT 
USING ((auth.uid() = caller_id) OR (auth.uid() = callee_id) OR (get_user_role(auth.uid()) = 'admin'::user_role));

CREATE POLICY "Users can insert their own calls" 
ON public.video_calls 
FOR INSERT 
WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Call participants can update calls" 
ON public.video_calls 
FOR UPDATE 
USING ((auth.uid() = caller_id) OR (auth.uid() = callee_id) OR (get_user_role(auth.uid()) = 'admin'::user_role));

CREATE POLICY "Admins can manage all calls" 
ON public.video_calls 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- RLS policies for call_invitations
CREATE POLICY "Users can view their call invitations" 
ON public.call_invitations 
FOR SELECT 
USING ((auth.uid() = inviter_id) OR (auth.uid() = invitee_id) OR (get_user_role(auth.uid()) = 'admin'::user_role));

CREATE POLICY "Users can insert call invitations" 
ON public.call_invitations 
FOR INSERT 
WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Invitees can update invitations" 
ON public.call_invitations 
FOR UPDATE 
USING ((auth.uid() = invitee_id) OR (auth.uid() = inviter_id) OR (get_user_role(auth.uid()) = 'admin'::user_role));

CREATE POLICY "Admins can manage all invitations" 
ON public.call_invitations 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Create indexes for performance
CREATE INDEX idx_video_calls_participants ON public.video_calls(caller_id, callee_id);
CREATE INDEX idx_video_calls_status ON public.video_calls(status);
CREATE INDEX idx_video_calls_created_at ON public.video_calls(created_at DESC);
CREATE INDEX idx_call_invitations_invitee ON public.call_invitations(invitee_id, status);
CREATE INDEX idx_call_invitations_expires_at ON public.call_invitations(expires_at);

-- Add triggers for updating timestamps
CREATE TRIGGER update_video_calls_updated_at
BEFORE UPDATE ON public.video_calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_call_invitations_updated_at
BEFORE UPDATE ON public.call_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER publication supabase_realtime ADD TABLE public.video_calls;
ALTER publication supabase_realtime ADD TABLE public.call_invitations;

-- Set replica identity for realtime updates
ALTER TABLE public.video_calls REPLICA IDENTITY FULL;
ALTER TABLE public.call_invitations REPLICA IDENTITY FULL;