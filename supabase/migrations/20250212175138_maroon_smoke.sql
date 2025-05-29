-- Create storage bucket for banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true);

-- Create storage policies for the banners bucket
CREATE POLICY "Give public access to banners bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

CREATE POLICY "Allow authenticated users to upload files to banners bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in banners bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from banners bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);