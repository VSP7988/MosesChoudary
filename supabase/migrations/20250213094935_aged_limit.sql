-- Drop the gallery table if it exists
DROP TABLE IF EXISTS childrens_home_gallery;

-- Drop storage policies for the gallery bucket
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Give public access to childrens home gallery bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload files to childrens home gallery bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update files in childrens home gallery bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete files from childrens home gallery bucket" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Drop the storage bucket
DELETE FROM storage.buckets WHERE id = 'childrens-home-gallery';