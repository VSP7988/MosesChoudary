/*
  # Update YouTube Videos Table Structure

  1. Changes
    - Remove title column from youtube_videos table since it's no longer needed
    
  2. Notes
    - This migration removes the not-null constraint by dropping the title column
*/

ALTER TABLE youtube_videos DROP COLUMN IF EXISTS title;