/*
  # Add month column to newsletters table

  1. Changes
    - Add month column to newsletters table
    - Set month values based on published_date
*/

-- Add month column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'newsletters' AND column_name = 'month'
  ) THEN
    ALTER TABLE newsletters ADD COLUMN month integer;
  END IF;
END $$;

-- Update month values based on published_date
UPDATE newsletters 
SET month = EXTRACT(MONTH FROM published_date::date)
WHERE month IS NULL;