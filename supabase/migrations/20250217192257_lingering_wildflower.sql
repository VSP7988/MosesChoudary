-- Create pastors table
CREATE TABLE IF NOT EXISTS pastors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pastors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on pastors"
  ON pastors FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on pastors"
  ON pastors FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for pastor images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pastors', 'pastors', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the pastors bucket
CREATE POLICY "Give public access to pastors bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'pastors');

CREATE POLICY "Allow authenticated users to upload files to pastors bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pastors' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in pastors bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pastors' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from pastors bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pastors' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);