-- 1. ADD SELLER_ID AND ANALYTICS TO PRODUCTS
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales INTEGER DEFAULT 0;

-- 2. ENABLE ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES FOR PRODUCTS

-- 3.1 VIEW POLICY: Everyone can view active products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
CREATE POLICY "Anyone can view products" ON products
FOR SELECT USING (true);

-- 3.2 INSERT POLICY: Authenticated sellers can insert their own products
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
CREATE POLICY "Sellers can insert their own products" ON products
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = seller_id AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'seller' AND status = 'approved'
  )
);

-- 3.3 UPDATE POLICY: Sellers can update their own products
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
CREATE POLICY "Sellers can update their own products" ON products
FOR UPDATE TO authenticated
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- 3.4 DELETE POLICY: Sellers can delete their own products
DROP POLICY IF EXISTS "Sellers can delete their own products" ON products;
CREATE POLICY "Sellers can delete their own products" ON products
FOR DELETE TO authenticated
USING (auth.uid() = seller_id);

-- 3.5 ADMIN POLICY: Full access for admins
DROP POLICY IF EXISTS "Admins have full access to products" ON products;
CREATE POLICY "Admins have full access to products" ON products
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  )
);

-- 4. VIEW LOGS/STATS POLICIES (If tables exist)
-- Example: ALTER TABLE views ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Sellers can view stats of their own products" ON views ...

-- 5. ANALYTICS FUNCTIONS
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET views = COALESCE(views, 0) + 1
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
