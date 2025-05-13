/*
  # Add newsletters functionality

  1. New Tables
    - `newsletters`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `language` (text)
      - `pdf_url` (text)
      - `published_date` (date)
      - `created_at` (timestamp)

  2. Storage
    - Create newsletters storage bucket
    - Add storage policies for public access and admin management

  3. Security
    - Enable RLS on newsletters table
    - Add policies for public read access
    - Add policies for admin management
*/

-- Create newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  language text NOT NULL CHECK (language IN ('english', 'norwegian')),
  pdf_url text NOT NULL,
  published_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE newsletters ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on newsletters"
  ON newsletters FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on newsletters"
  ON newsletters FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for newsletters
INSERT INTO storage.buckets (id, name, public)
VALUES ('newsletters', 'newsletters', true);

-- Create storage policies for the newsletters bucket
CREATE POLICY "Give public access to newsletters bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'newsletters');

CREATE POLICY "Allow authenticated users to upload files to newsletters bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'newsletters' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in newsletters bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'newsletters' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from newsletters bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'newsletters' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);