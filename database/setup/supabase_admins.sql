-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'super_admin', -- super_admin, moderator, curator
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Policies
-- Admins can view other admins (only if they are an admin themselves)
CREATE POLICY "Admins can view admins" ON admins
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Only a super admin should be able to insert/delete, for now manually managed via Supabase Dashboard
-- or you can run this to make your first user an admin:
-- INSERT INTO admins (id, email) VALUES ('YOUR_USER_ID', 'your@email.com');
