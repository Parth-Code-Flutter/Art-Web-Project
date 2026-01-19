-- COMPREHENSIVE FIX FOR ADMIN PANEL ORDER ACCESS
-- Run this entire script in Supabase SQL Editor

-- Step 1: First, let's see what user you're logged in as
SELECT 
    auth.uid() as current_user_id,
    (SELECT email FROM auth.users WHERE id = auth.uid()) as current_email;

-- Step 2: Check current admins
SELECT * FROM admins;

-- Step 3: Get the user ID for parth.mandavia.tristate@gmail.com
SELECT id, email, created_at FROM auth.users 
WHERE email = 'parth.mandavia.tristate@gmail.com';

-- Step 4: Add parth.mandavia.tristate@gmail.com as admin
-- IMPORTANT: Copy the ID from Step 3 and replace it below
INSERT INTO admins (id, email, role, full_name) 
SELECT 
    id,
    'parth.mandavia.tristate@gmail.com',
    'super_admin',
    'Parth Mandavia'
FROM auth.users 
WHERE email = 'parth.mandavia.tristate@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin',
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name;

-- Step 5: Verify admin was added
SELECT * FROM admins ORDER BY created_at;

-- Step 6: Test if you can see orders now
SELECT 
    o.id,
    o.full_name,
    o.email,
    o.total_amount,
    o.status,
    o.created_at,
    COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.full_name, o.email, o.total_amount, o.status, o.created_at
ORDER BY o.created_at DESC;

-- Step 7: If orders still don't show, let's check the RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;
