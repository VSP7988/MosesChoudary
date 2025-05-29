/*
  # Add Pastors Fellowship Banners Storage Bucket

  1. Storage
    - Create new bucket 'pastors-fellowship-banners' for storing banner images
    - Enable public access for reading images
    - Restrict write access to authenticated users
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pastors-fellowship-banners', 'pastors-fellowship-banners', true);

-- Set up security policies for the bucket
CREATE POLICY "Give public access to pastors-fellowship-banners"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pastors-fellowship-banners');

CREATE POLICY "Allow authenticated users to upload to pastors-fellowship-banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pastors-fellowship-banners');

CREATE POLICY "Allow authenticated users to update pastors-fellowship-banners"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pastors-fellowship-banners');

CREATE POLICY "Allow authenticated users to delete from pastors-fellowship-banners"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pastors-fellowship-banners');