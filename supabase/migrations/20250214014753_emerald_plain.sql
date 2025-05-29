-- Create oldage_home_content table
CREATE TABLE IF NOT EXISTS oldage_home_content (
  id text PRIMARY KEY DEFAULT 'default',
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE oldage_home_content ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on oldage_home_content" ON oldage_home_content;
  DROP POLICY IF EXISTS "Allow admin full access on oldage_home_content" ON oldage_home_content;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oldage_home_content"
  ON oldage_home_content FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on oldage_home_content"
  ON oldage_home_content FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert default content
INSERT INTO oldage_home_content (id, title, content)
VALUES (
  'default',
  'About Our Oldage Home',
  '<h2>Our Mission</h2><p>At our Oldage Home, we are dedicated to providing a loving, caring, and dignified environment for our elderly residents. Our mission is to ensure that every senior in our care experiences comfort, companionship, and the highest quality of life possible.</p><h2>Our Approach</h2><p>We believe in a holistic approach to elderly care that addresses not just physical needs, but also emotional, social, and spiritual well-being. Our dedicated staff works around the clock to provide personalized care and attention to each resident.</p><h2>Our Commitment</h2><p>We are committed to maintaining the dignity and independence of our residents while providing the support they need. Our facility is designed to create a home-like atmosphere where seniors can live comfortably and engage in meaningful activities.</p>'
) ON CONFLICT (id) DO NOTHING;