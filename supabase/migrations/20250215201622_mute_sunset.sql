/*
  # Add donation QR codes management

  1. New Tables
    - `donation_qr_codes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `qr_image_url` (text)
      - `payment_link` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `donation_qr_codes` table
    - Add policies for public read access
    - Add policies for admin full access
    - Create storage bucket for QR code images
    - Add storage policies for the bucket
*/

-- Create donation_qr_codes table
CREATE TABLE IF NOT EXISTS donation_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  qr_image_url text NOT NULL,
  payment_link text NOT NULL,
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

-- Create storage bucket for donation QR codes
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