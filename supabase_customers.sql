-- 1. CREATE TABLE IF NOT EXISTS (Basic setup)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  mobile TEXT UNIQUE,
  country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ADD COLUMN IF IT DOESN'T EXIST (Safe for existing tables)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='customers' AND column_name='profile_image_url') THEN
        ALTER TABLE customers ADD COLUMN profile_image_url TEXT;
    END IF;
END $$;

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- 4. RECREATE POLICIES SAFELY
-- Drop existing policies first to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow public registration" ON customers;
DROP POLICY IF EXISTS "Allow public login search" ON customers;

-- Create fresh policies
CREATE POLICY "Allow public registration" ON customers 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public login search" ON customers 
  FOR SELECT USING (true);
