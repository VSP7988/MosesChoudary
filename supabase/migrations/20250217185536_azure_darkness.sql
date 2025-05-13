-- Create magazines table
CREATE TABLE IF NOT EXISTS magazines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  month integer NOT NULL CHECK (month >= 1 AND month <= 12),
  title text NOT NULL,
  image_url text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE magazines ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on magazines"
  ON magazines FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on magazines"
  ON magazines FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for magazines
INSERT INTO storage.buckets (id, name, public)
VALUES ('magazines', 'magazines', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the magazines bucket
CREATE POLICY "Give public access to magazines bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'magazines');

CREATE POLICY "Allow authenticated users to upload files to magazines bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'magazines' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in magazines bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'magazines' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from magazines bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'magazines' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);