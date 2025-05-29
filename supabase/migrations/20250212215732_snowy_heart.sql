/*
  # Add Vedapatasala Content Support

  1. New Tables
    - `vedapatasala_content`
      - `id` (text, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `vedapatasala_content` table
    - Add policies for public read access
    - Add policies for admin full access
*/

-- Create vedapatasala_content table
CREATE TABLE IF NOT EXISTS vedapatasala_content (
  id text PRIMARY KEY DEFAULT 'default',
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE vedapatasala_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on vedapatasala_content"
  ON vedapatasala_content FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on vedapatasala_content"
  ON vedapatasala_content FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert default content
INSERT INTO vedapatasala_content (id, title, content)
VALUES (
  'default',
  'Veda Patasala - Vizag',
  '<h2>About Our Veda Patasala</h2><p>Welcome to our Veda Patasala in Visakhapatnam, a center of spiritual learning and theological education. Established with a vision to preserve and propagate traditional vedic knowledge while integrating modern theological studies, our institution stands as a beacon of spiritual wisdom and practical ministry training.</p><h2>Our Vision</h2><p>Our vision is to equip the next generation of spiritual leaders with a strong foundation in biblical knowledge, theological understanding, and practical ministry skills. We believe in providing comprehensive education that bridges traditional wisdom with contemporary pastoral needs.</p><h2>Educational Approach</h2><p>At our Veda Patasala, we combine traditional teaching methods with modern educational practices. Our curriculum is designed to provide students with a deep understanding of scripture, theology, and practical ministry skills, preparing them for effective service in today''s world.</p>'
) ON CONFLICT (id) DO NOTHING;