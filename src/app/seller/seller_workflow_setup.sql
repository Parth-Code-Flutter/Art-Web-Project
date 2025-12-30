-- 1. CLEANUP (Optional: Be careful if you have existing data)
-- DROP TABLE IF EXISTS profiles;

-- 2. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  mobile TEXT,
  country TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SELLERS TABLE (Artists)
CREATE TABLE IF NOT EXISTS sellers (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  mobile TEXT,
  bio TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ENABLE RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 6. POLICIES FOR CUSTOMERS
DROP POLICY IF EXISTS "Customers can view own data" ON customers;
CREATE POLICY "Customers can view own data" ON customers
FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can register as customer" ON customers;
CREATE POLICY "Anyone can register as customer" ON customers
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
CREATE POLICY "Admins can view all customers" ON customers
FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 7. POLICIES FOR SELLERS
DROP POLICY IF EXISTS "Sellers can view own data" ON sellers;
CREATE POLICY "Sellers can view own data" ON sellers
FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can register as seller" ON sellers;
CREATE POLICY "Anyone can register as seller" ON sellers
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Sellers can update own data" ON sellers;
CREATE POLICY "Sellers can update own data" ON sellers
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all sellers" ON sellers;
CREATE POLICY "Admins can view all sellers" ON sellers
FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can update all sellers" ON sellers;
CREATE POLICY "Admins can update all sellers" ON sellers
FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- 8. POLICIES FOR ADMINS
DROP POLICY IF EXISTS "Admins can view admins" ON admins;
CREATE POLICY "Admins can view admins" ON admins
FOR SELECT TO authenticated USING (true);

-- 9. UPDATE PRODUCTS TABLE (Reference sellers instead of profiles)
-- If profiles table is deleted, we need to update the foreign key
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_seller_id_fkey;
ALTER TABLE products ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES sellers(id);

-- 10. PRODUCT POLICIES (Updated for sellers table)
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
CREATE POLICY "Sellers can insert their own products" ON products
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = seller_id AND 
  EXISTS (
    SELECT 1 FROM sellers 
    WHERE id = auth.uid() AND status = 'approved'
  )
);
