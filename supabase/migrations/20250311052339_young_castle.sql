/*
  # Add Pastors Fellowship Banners Table

  1. New Tables
    - `pastors_fellowship_banners`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `pastors_fellowship_banners` table
    - Add policy for authenticated users to manage banners
    - Add policy for public users to read banners
*/

-- Create pastors_fellowship_banners table
CREATE TABLE IF NOT EXISTS pastors_fellowship_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pastors_fellowship_banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow admin full access on pastors_fellowship_banners"
  ON pastors_fellowship_banners
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()));

CREATE POLICY "Allow public read access on pastors_fellowship_banners"
  ON pastors_fellowship_banners
  FOR SELECT
  TO public
  USING (true);