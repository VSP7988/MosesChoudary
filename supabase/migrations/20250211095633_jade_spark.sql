/*
  # Add Certifications Storage Bucket

  1. New Storage Bucket
    - Creates a public storage bucket named 'certifications'
    - Used for storing certification images and PDFs

  2. Security
    - Enables public read access to files in the bucket
    - Restricts write operations to authenticated admin users
    - Policies for insert, update, and delete operations
*/

-- Create storage bucket for certifications
INSERT INTO storage.buckets (id, name, public)
VALUES ('certifications', 'certifications', true);

-- Create storage policies for the certifications bucket
CREATE POLICY "Give public access to certifications bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'certifications');

CREATE POLICY "Allow authenticated users to upload files to certifications bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certifications' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in certifications bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certifications' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from certifications bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'certifications' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);