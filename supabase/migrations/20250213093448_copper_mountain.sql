-- Drop existing table if it exists
DROP TABLE IF EXISTS childrens_home_stories;

-- Create childrens_home_stories table
CREATE TABLE childrens_home_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE childrens_home_stories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on childrens_home_stories" ON childrens_home_stories;
  DROP POLICY IF EXISTS "Allow admin full access on childrens_home_stories" ON childrens_home_stories;
  DROP POLICY IF EXISTS "Give public access to childrens home stories bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload files to childrens home stories bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update files in childrens home stories bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete files from childrens home stories bucket" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access on childrens_home_stories"
  ON childrens_home_stories FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on childrens_home_stories"
  ON childrens_home_stories FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for childrens home stories if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('childrens-home-stories', 'childrens-home-stories', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the childrens home stories bucket
CREATE POLICY "Give public access to childrens home stories bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'childrens-home-stories');

CREATE POLICY "Allow authenticated users to upload files to childrens home stories bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'childrens-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in childrens home stories bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'childrens-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from childrens home stories bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'childrens-home-stories' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);