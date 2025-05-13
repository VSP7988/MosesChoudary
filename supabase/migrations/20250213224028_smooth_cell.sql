-- Create oldage_home_banners table
CREATE TABLE IF NOT EXISTS oldage_home_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE oldage_home_banners ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oldage_home_banners"
  ON oldage_home_banners FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on oldage_home_banners"
  ON oldage_home_banners FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create oldage_home_stories table
CREATE TABLE IF NOT EXISTS oldage_home_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE oldage_home_stories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oldage_home_stories"
  ON oldage_home_stories FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on oldage_home_stories"
  ON oldage_home_stories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create oldage_home_gallery table
CREATE TABLE IF NOT EXISTS oldage_home_gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE oldage_home_gallery ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oldage_home_gallery"
  ON oldage_home_gallery FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on oldage_home_gallery"
  ON oldage_home_gallery FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create oldage_home_testimonials table
CREATE TABLE IF NOT EXISTS oldage_home_testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote text NOT NULL,
  author text NOT NULL,
  role text NOT NULL,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE oldage_home_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oldage_home_testimonials"
  ON oldage_home_testimonials FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on oldage_home_testimonials"
  ON oldage_home_testimonials FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('oldage-home-banners', 'oldage-home-banners', true),
  ('oldage-home-stories', 'oldage-home-stories', true),
  ('oldage-home-gallery', 'oldage-home-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for oldage home banners bucket
CREATE POLICY "Give public access to oldage home banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'oldage-home-banners');

CREATE POLICY "Allow authenticated users to upload files to oldage home banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'oldage-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in oldage home banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'oldage-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from oldage home banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'oldage-home-banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

-- Create storage policies for oldage home stories bucket
CREATE POLICY "Give public access to oldage home stories bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'oldage-home-stories');

CREATE POLICY "Allow authenticated users to upload files to oldage home stories bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'oldage-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in oldage home stories bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'oldage-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from oldage home stories bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'oldage-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

-- Create storage policies for oldage home gallery bucket
CREATE POLICY "Give public access to oldage home gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'oldage-home-gallery');

CREATE POLICY "Allow authenticated users to upload files to oldage home gallery bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'oldage-home-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in oldage home gallery bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'oldage-home-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from oldage home gallery bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'oldage-home-gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);