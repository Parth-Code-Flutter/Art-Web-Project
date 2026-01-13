-- Check if your user is in the admins table
-- Run this first to see your current user ID and check admin status

-- 1. Check current admins
SELECT * FROM admins;

-- 2. If your user is NOT in the admins table, add them:
-- Replace 'YOUR_USER_ID' with the customer_id from one of your orders
-- You can see this in the orders table screenshot you shared

-- INSERT INTO admins (id, email, role) 
-- VALUES ('5c353d04-6049-4bc8-935e-3e8d8a...', 'parth.mandavia.tristate@gmail.com', 'super_admin');

-- 3. Verify the admin was added
SELECT * FROM admins;

-- 4. Test if you can now see orders (run this in SQL editor to verify RLS is working)
-- SELECT * FROM orders;
