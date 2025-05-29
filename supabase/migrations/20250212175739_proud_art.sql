/*
  # Update banners table schema

  1. Changes
    - Make title column nullable in banners table

  2. Notes
    - This allows banners to be created without a title
    - Maintains backward compatibility with existing records
*/

ALTER TABLE banners
ALTER COLUMN title DROP NOT NULL;