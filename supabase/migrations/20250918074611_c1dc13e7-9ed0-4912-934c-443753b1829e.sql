-- Ensure requests.requirements is jsonb, not json, to avoid equality operator errors
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

    -- Ensure a safe default
    ALTER TABLE public.requests 
      ALTER COLUMN requirements SET DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Also double-check any defaults that might be json instead of jsonb
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM pg_attrdef d
    JOIN pg_class c ON c.oid = d.adrelid
    JOIN pg_attribute a ON a.attrelid = d.adrelid AND a.attnum = d.adnum
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'requests' AND a.attname = 'requirements'
      AND pg_get_expr(d.adbin, d.adrelid) ~ '::json\)'
  ) THEN
    ALTER TABLE public.requests 
      ALTER COLUMN requirements SET DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- For safety, avoid any leftover constraints comparing JSON
-- (No-op if they don't exist)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT polname, pg_get_expr(pol.polqual, pol.polrelid) AS using_expr
    FROM pg_policy pol
    WHERE pol.polrelid = 'public.requests'::regclass
  LOOP
    -- This block is informational; we are not altering policies here to respect existing security
    -- If any policy uses '=' on requirements::json, consider casting to jsonb in future migrations
    CONTINUE;
  END LOOP;
END $$;
