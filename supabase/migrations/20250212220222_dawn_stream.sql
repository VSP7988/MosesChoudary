/*
  # Add Vedapatasala Gallery Support

  1. New Tables
    - `vedapatasala_gallery`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `vedapatasala_gallery` table
    - Add policies for public read access
    - Add policies for admin full access
    - Create storage bucket and policies for gallery images
*/

-- Create vedapatasala_gallery table
CREATE TABLE IF NOT EXISTS vedapatasala_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vedapatasala_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on vedapatasala_gallery"
  ON vedapatasala_gallery FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on vedapatasala_gallery"
  ON vedapatasala_gallery FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for vedapatasala gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('vedapatasala-gallery', 'vedapatasala-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the vedapatasala gallery bucket
CREATE POLICY "Give public access to vedapatasala gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'vedapatasala-gallery');

CREATE POLICY "Allow authenticated users to upload files to vedapatasala gallery bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vedapatasala-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in vedapatasala gallery bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vedapatasala-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from vedapatasala gallery bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vedapatasala-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);