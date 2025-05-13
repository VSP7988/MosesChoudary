/*
  # Add Founder Hero Video Management
  
  1. New Tables
    - `founder_hero_video`
      - `id` (text, primary key)
      - `video_id` (text, not null)
      - `title` (text, not null)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `founder_hero_video` table
    - Add policies for public read access
    - Add policies for admin full access
*/

CREATE TABLE IF NOT EXISTS founder_hero_video (
  id text PRIMARY KEY DEFAULT 'default',
  video_id text NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE founder_hero_video ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on founder_hero_video"
  ON founder_hero_video FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on founder_hero_video"
  ON founder_hero_video FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));