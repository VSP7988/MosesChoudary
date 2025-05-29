/*
  # Create logo table and storage

  1. New Tables
    - `logo` table for storing logo information
      - `id` (text, primary key)
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Storage
    - Create logo storage bucket
    - Set up storage policies

  3. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin full access
*/

-- Create logo table
CREATE TABLE IF NOT EXISTS logo (
  id text PRIMARY KEY,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE logo ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on logo" ON logo;
  DROP POLICY IF EXISTS "Allow admin full access on logo" ON logo;
  DROP POLICY IF EXISTS "Give public access to logo bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload files to logo bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update files in logo bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete files from logo bucket" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access on logo"
  ON logo FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on logo"
  ON logo FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for logo if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo', 'logo', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the logo bucket
CREATE POLICY "Give public access to logo bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'logo');

CREATE POLICY "Allow authenticated users to upload files to logo bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logo' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in logo bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logo' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from logo bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logo' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);