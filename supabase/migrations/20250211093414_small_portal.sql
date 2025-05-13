/*
  # Create certifications table

  1. New Tables
    - `certifications`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `pdf_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `certifications` table
    - Add policy for public read access
    - Add policy for admin full access
*/

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on certifications"
  ON certifications FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on certifications"
  ON certifications FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));