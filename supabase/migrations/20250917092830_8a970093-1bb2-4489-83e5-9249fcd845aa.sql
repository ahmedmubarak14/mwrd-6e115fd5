-- Add explicit INSERT policy for requests so authenticated clients can create their own requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'requests' AND policyname = 'Clients can insert own requests'
  ) THEN
    CREATE POLICY "Clients can insert own requests"
    ON public.requests
    FOR INSERT
    WITH CHECK (auth.uid() = client_id);
  END IF;
END $$;

-- Optional: ensure realtime continues to work (idempotent)
ALTER TABLE public.requests REPLICA IDENTITY FULL;