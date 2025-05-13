-- Create storage bucket for events
INSERT INTO storage.buckets (id, name, public)
VALUES ('events', 'events', true);

-- Create storage policies for the events bucket
CREATE POLICY "Give public access to events bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'events');

CREATE POLICY "Allow authenticated users to upload files to events bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in events bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from events bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);