/*
  # Add founder content management

  1. New Tables
    - `founder_content`
      - `id` (text, primary key)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `founder_content` table
    - Add policies for public read access
    - Add policies for admin full access
*/

CREATE TABLE IF NOT EXISTS founder_content (
  id text PRIMARY KEY DEFAULT 'default',
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE founder_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on founder_content"
  ON founder_content FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on founder_content"
  ON founder_content FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert default content
INSERT INTO founder_content (id, title, content)
VALUES (
  'default',
  'About Pastor Moses Choudary',
  '<h2>Our Journey of Faith</h2><p>Established in the year 1982 with a God given vision, the ministry of Maranatha Visvasa Samajam was started by Pastor Moses Choudary Gullapalli with a unique strategy to reach the unreached people groups in India in the context of their culture.</p><p>With over 52 years of ministerial experience, and a heart burning for the lost, poor, and hurting, Pastor Choudary is a graduate of Lee College with B.S. in Biblical Studies, and of Church of God Theological Seminary with MA in Missiology.</p><p>Today, this ministry has 140 Pastors & about 200 Churches, 3 Bible Schools training young men and women for the ministry. Three Children Homes with 275 boys & girls from orphan, poor, and needy backgrounds, an Asram caring for the widows & destitute. A Monthly Magazine in Telugu language and a Television Ministry to reach the unreached millions in the 10-40 window.</p>'
) ON CONFLICT (id) DO NOTHING;