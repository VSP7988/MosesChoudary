/*
  # Initial Schema Setup for Moses Choudary Website

  1. New Tables
    - `banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (date)
      - `image_url` (text)
      - `created_at` (timestamp)
      
    - `youtube_videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `video_id` (text)
      - `created_at` (timestamp)
      
    - `gallery_images`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      
    - `admins`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admins to manage content
    - Add policies for public read access
*/

-- Create tables
CREATE TABLE banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE youtube_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on banners"
  ON banners FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on events"
  ON events FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on youtube_videos"
  ON youtube_videos FOR SELECT TO public USING (true);

CREATE POLICY "Allow public read access on gallery_images"
  ON gallery_images FOR SELECT TO public USING (true);

-- Create policies for admin access
CREATE POLICY "Allow admin full access on banners"
  ON banners FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Allow admin full access on events"
  ON events FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Allow admin full access on youtube_videos"
  ON youtube_videos FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Allow admin full access on gallery_images"
  ON gallery_images FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Allow admin read own data"
  ON admins FOR SELECT TO authenticated
  USING (auth.uid() = id);