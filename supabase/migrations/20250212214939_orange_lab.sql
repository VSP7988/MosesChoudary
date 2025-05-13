-- Create vedapatasala_banners table
CREATE TABLE IF NOT EXISTS vedapatasala_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subtitle text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vedapatasala_banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on vedapatasala_banners"
  ON vedapatasala_banners FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on vedapatasala_banners"
  ON vedapatasala_banners FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for vedapatasala banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('vedapatasala-banners', 'vedapatasala-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the vedapatasala banners bucket
CREATE POLICY "Give public access to vedapatasala banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'vedapatasala-banners');

CREATE POLICY "Allow authenticated users to upload files to vedapatasala banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vedapatasala-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in vedapatasala banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vedapatasala-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from vedapatasala banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vedapatasala-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);