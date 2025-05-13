/*
  # Add PDF URL to Vedapatasala Content

  1. Changes
    - Add pdf_url column to vedapatasala_content table
    - Make it nullable since not all content may have a PDF

  2. Security
    - Maintain existing RLS policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'vedapatasala_content' AND column_name = 'pdf_url'
  ) THEN
    ALTER TABLE vedapatasala_content ADD COLUMN pdf_url text;
  END IF;
END $$;