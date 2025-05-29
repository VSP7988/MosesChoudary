-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on donation_qr_codes" ON donation_qr_codes;
  DROP POLICY IF EXISTS "Allow admin full access on donation_qr_codes" ON donation_qr_codes;
  DROP POLICY IF EXISTS "Give public access to donation QR codes bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload files to donation QR codes bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update files in donation QR codes bucket" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete files from donation QR codes bucket" ON storage.objects;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Drop existing table if it exists
DROP TABLE IF EXISTS donation_qr_codes;

-- Create donation_qr_codes table
CREATE TABLE donation_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  qr_image_url text NOT NULL,
  payment_link text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE donation_qr_codes ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on donation_qr_codes"
  ON donation_qr_codes FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on donation_qr_codes"
  ON donation_qr_codes FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for donation QR codes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-qr-codes', 'donation-qr-codes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the donation QR codes bucket
CREATE POLICY "Give public access to donation QR codes bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'donation-qr-codes');

CREATE POLICY "Allow authenticated users to upload files to donation QR codes bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'donation-qr-codes' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in donation QR codes bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'donation-qr-codes' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from donation QR codes bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'donation-qr-codes' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);