-- Fix potential JSON type issue on requests.requirements by converting to jsonb if needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'requests' 
      AND column_name = 'requirements' 
      AND data_type = 'json'
  ) THEN
    ALTER TABLE public.requests 
      ALTER COLUMN requirements TYPE jsonb 
      USING requirements::jsonb;
  END IF;
  -- Ensure default is jsonb
  ALTER TABLE public.requests 
    ALTER COLUMN requirements SET DEFAULT '{}'::jsonb;
END $$;