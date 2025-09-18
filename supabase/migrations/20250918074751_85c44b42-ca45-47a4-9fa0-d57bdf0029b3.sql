-- Fix the requirements column type to be jsonb instead of json
ALTER TABLE public.requests 
  ALTER COLUMN requirements TYPE jsonb 
  USING requirements::jsonb;

-- Ensure proper default value
ALTER TABLE public.requests 
  ALTER COLUMN requirements SET DEFAULT '{}'::jsonb;