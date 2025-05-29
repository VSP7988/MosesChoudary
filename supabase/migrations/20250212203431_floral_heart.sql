/*
  # Create Founder Gallery Table and Storage

  1. New Tables
    - `founder_gallery`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `founder_gallery` table
    - Add policies for public read access
    - Add policies for admin full access
    - Create storage bucket and policies for founder gallery images
*/

-- Create founder gallery table
CREATE TABLE IF NOT EXISTS founder_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE founder_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on founder_gallery"
  ON founder_gallery FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on founder_gallery"
  ON founder_gallery FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for founder gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('founder-gallery', 'founder-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the founder gallery bucket
CREATE POLICY "Give public access to founder gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'founder-gallery');

CREATE POLICY "Allow authenticated users to upload files to founder gallery bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'founder-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in founder gallery bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'founder-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from founder gallery bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'founder-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);