/*
  # Create Vedapatasala PDFs Storage Bucket

  1. New Storage Bucket
    - Creates a new storage bucket for Vedapatasala PDFs
    - Enables public access for reading PDFs
    - Sets file size limits and allowed mime types
*/

-- Create the storage bucket for Vedapatasala PDFs
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'vedapatasala-pdfs',
    'vedapatasala-pdfs',
    true,
    10485760, -- 10MB file size limit
    array['application/pdf']
  );
  
  -- Set up CORS configuration through storage.buckets
  UPDATE storage.buckets
  SET owner = auth.uid(),
      created_at = NOW(),
      updated_at = NOW()
  WHERE id = 'vedapatasala-pdfs';
END $$;