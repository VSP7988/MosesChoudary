/*
  # Add newsletter columns

  1. Changes
    - Add image_url column to newsletters table
    - Add year column to newsletters table
    - Remove content column as it's not needed anymore

  2. Notes
    - All new columns are required (NOT NULL)
    - Existing content column is dropped
*/

-- Add new columns
ALTER TABLE newsletters 
ADD COLUMN IF NOT EXISTS image_url text NOT NULL,
ADD COLUMN IF NOT EXISTS year integer NOT NULL;

-- Remove unused column
ALTER TABLE newsletters 
DROP COLUMN IF EXISTS content;