/*
  # Create Logo Table

  1. New Tables
    - `logo`
      - `id` (text, primary key)
      - `image_url` (text, not null)
      - `created_at` (timestamptz)

  2. Storage
    - Create logo storage bucket
    - Add storage policies for public access and admin management

  3. Security
    - Enable RLS
    - Add policies for public read access
    - Add policies for admin management
*/

-- Create logo table
CREATE TABLE IF NOT EXISTS logo (
  id text PRIMARY KEY,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE logo ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on logo"
  ON logo FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on logo"
  ON logo FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for logo
INSERT INTO storage.buckets (id, name, public)
VALUES ('logo', 'logo', true);

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