/*
  # Configure Vedapatasala PDFs Storage

  1. Storage Setup
    - Creates storage bucket for Vedapatasala PDFs
    - Configures public access and file limits
    - Sets up proper storage policies for authenticated users

  2. Security
    - Enables authenticated users to upload PDFs
    - Allows public read access to PDFs
    - Sets appropriate file size and type restrictions
*/

-- Create the storage bucket for Vedapatasala PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vedapatasala-pdfs',
  'vedapatasala-pdfs',
  true,
  10485760, -- 10MB file size limit
  array['application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload PDFs
CREATE POLICY "Allow authenticated users to upload PDFs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vedapatasala-pdfs'
  AND owner = auth.uid()
);

-- Create policy to allow authenticated users to update their own PDFs
CREATE POLICY "Allow authenticated users to update their PDFs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vedapatasala-pdfs'
  AND owner = auth.uid()
)
WITH CHECK (
  bucket_id = 'vedapatasala-pdfs'
  AND owner = auth.uid()
);

-- Create policy to allow authenticated users to delete their own PDFs
CREATE POLICY "Allow authenticated users to delete their PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vedapatasala-pdfs'
  AND owner = auth.uid()
);

-- Create policy to allow public read access to PDFs
CREATE POLICY "Allow public to read PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vedapatasala-pdfs');