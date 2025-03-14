-- Create tv_schedule table
CREATE TABLE IF NOT EXISTS tv_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  time text NOT NULL,
  channel text NOT NULL,
  program text NOT NULL,
  hosts text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tv_schedule ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on tv_schedule"
  ON tv_schedule FOR SELECT TO public USING (true);

-- Create policy for admin full access
CREATE POLICY "Allow admin full access on tv_schedule"
  ON tv_schedule FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));