-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access on childrens_home_testimonials" ON childrens_home_testimonials;
  DROP POLICY IF EXISTS "Allow admin full access on childrens_home_testimonials" ON childrens_home_testimonials;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public read access on childrens_home_testimonials"
  ON childrens_home_testimonials FOR SELECT TO public USING (true);

CREATE POLICY "Allow admin full access on childrens_home_testimonials"
  ON childrens_home_testimonials FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));