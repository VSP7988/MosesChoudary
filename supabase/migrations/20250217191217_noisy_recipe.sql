-- Create pastors_fellowship_content table
CREATE TABLE IF NOT EXISTS pastors_fellowship_content (
  id text PRIMARY KEY DEFAULT 'default',
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pastors_fellowship_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on pastors_fellowship_content"
  ON pastors_fellowship_content FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on pastors_fellowship_content"
  ON pastors_fellowship_content FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create pastors_fellowship_events table
CREATE TABLE IF NOT EXISTS pastors_fellowship_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date date NOT NULL,
  location text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pastors_fellowship_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on pastors_fellowship_events"
  ON pastors_fellowship_events FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on pastors_fellowship_events"
  ON pastors_fellowship_events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for pastors fellowship events
INSERT INTO storage.buckets (id, name, public)
VALUES ('pastors-fellowship-events', 'pastors-fellowship-events', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the pastors fellowship events bucket
CREATE POLICY "Give public access to pastors fellowship events bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'pastors-fellowship-events');

CREATE POLICY "Allow authenticated users to upload files to pastors fellowship events bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pastors-fellowship-events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in pastors fellowship events bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pastors-fellowship-events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from pastors fellowship events bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'pastors-fellowship-events' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

-- Insert default content
INSERT INTO pastors_fellowship_content (id, title, content)
VALUES (
  'default',
  'Pastors Fellowship',
  '<h2>Welcome to Our Pastors Fellowship</h2><p>Our Pastors Fellowship is a vibrant community of spiritual leaders dedicated to mutual support, growth, and the advancement of God''s kingdom. Through regular meetings, prayer sessions, and collaborative initiatives, we strengthen our collective ministry impact.</p><h2>Our Vision</h2><p>We envision a united body of pastors working together to transform communities through the power of the Gospel, providing support and encouragement to one another in our shared mission.</p><h2>What We Offer</h2><ul><li>Monthly fellowship meetings</li><li>Prayer support networks</li><li>Leadership development programs</li><li>Collaborative community outreach</li><li>Pastoral care and counseling</li></ul>'
) ON CONFLICT (id) DO NOTHING;