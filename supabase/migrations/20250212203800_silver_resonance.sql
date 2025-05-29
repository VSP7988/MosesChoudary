/*
  # Remove title requirement from founder gallery

  1. Changes
    - Make title column nullable in founder_gallery table
    - Add default empty string for title
*/

ALTER TABLE founder_gallery
ALTER COLUMN title DROP NOT NULL,
ALTER COLUMN title SET DEFAULT '';