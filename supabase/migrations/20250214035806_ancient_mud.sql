-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  image_url text NOT NULL,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on team_members"
  ON team_members FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on team_members"
  ON team_members FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create storage bucket for team members
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-members', 'team-members', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the team members bucket
CREATE POLICY "Give public access to team members bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-members');

CREATE POLICY "Allow authenticated users to upload files to team members bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'team-members' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to update files in team members bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'team-members' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);

CREATE POLICY "Allow authenticated users to delete files from team members bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'team-members' AND
  (EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid()))
);