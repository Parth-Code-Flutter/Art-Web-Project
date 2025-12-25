-- 1. CREATE CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT UNIQUE,
  country TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 3. CREATE POLICIES
-- Allow public registration (Insert)
CREATE POLICY "Allow public registration" ON customers 
  FOR INSERT WITH CHECK (true);

-- Allow public login check (Select)
-- In a real production app, we would use Supabase Auth, 
-- but this allows the manual table-based login requested.
CREATE POLICY "Allow public login search" ON customers 
  FOR SELECT USING (true);
