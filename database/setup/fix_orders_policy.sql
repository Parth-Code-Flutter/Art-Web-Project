-- FIX RLS POLICIES FOR ADMIN ACCESS
-- Run this whole script in Supabase SQL Editor

-- 1. Reset Admin Policies for Orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Admins can update all orders" ON orders
FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- 2. Reset Admin Policies for Order Items
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM admins WHERE id = auth.uid())
);

-- 3. DIAGNOSTIC: Check if your current session matches the admin table
-- If this returns NO ROWS, then your current login ID does NOT match the ID in the admins table.
SELECT * FROM admins WHERE id = auth.uid();
