-- Create storage bucket for gallery
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true);

-- Create storage policies for the gallery bucket
CREATE POLICY "Give public access to gallery bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Allow authenticated users to upload files to gallery bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in gallery bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from gallery bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);