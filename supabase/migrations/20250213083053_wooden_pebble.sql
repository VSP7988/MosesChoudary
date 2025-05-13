/*
  # Add Children's Home Banners Management

  1. New Tables
    - `childrens_home_banners`
      - `id` (uuid, primary key)
      - `image_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `childrens_home_banners` table
    - Add policies for public read access
    - Add policies for admin full access
    - Create storage bucket and policies for banner images
*/

-- Create childrens_home_banners table
CREATE TABLE IF NOT EXISTS childrens_home_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE childrens_home_banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on childrens_home_banners"
  ON childrens_home_banners FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on childrens_home_banners"
  ON childrens_home_banners FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for childrens home banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('childrens-home-banners', 'childrens-home-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the childrens home banners bucket
CREATE POLICY "Give public access to childrens home banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'childrens-home-banners');

CREATE POLICY "Allow authenticated users to upload files to childrens home banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'childrens-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in childrens home banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'childrens-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from childrens home banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'childrens-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);