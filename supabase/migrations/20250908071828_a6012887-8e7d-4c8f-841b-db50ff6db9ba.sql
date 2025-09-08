-- Fix JSON equality operator issue by ensuring location field is properly typed
-- and remove any problematic constraints

-- First, let's check the current requests table structure and fix any issues
DO $$
BEGIN
  -- Ensure location column is text (not json)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requests' 
    AND column_name = 'location' 
    AND data_type != 'text'
  ) THEN
    ALTER TABLE requests ALTER COLUMN location TYPE text;
  END IF;
  
  -- Ensure requirements column is jsonb (not json)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'requests' 
    AND column_name = 'requirements' 
    AND data_type = 'json'
  ) THEN
    ALTER TABLE requests ALTER COLUMN requirements TYPE jsonb USING requirements::jsonb;
  END IF;
END
$$;