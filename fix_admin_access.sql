-- FIX: Add your user to the admins table
-- This will allow you to view orders in the admin panel

-- Step 1: Get your user ID from the orders table
-- Look at the customer_id column in your orders - it should be: 5c353d04-6049-4bc8-935e-3e8d8a...

-- Step 2: Insert your user into the admins table
-- IMPORTANT: Replace the ID below with your actual full user ID from the orders table

INSERT INTO admins (id, email, role, full_name) 
VALUES (
    '5c353d04-6049-4bc8-935e-3e8d8a...', -- Replace with your full user ID
    'parth.mandavia.tristate@gmail.com',
    'super_admin',
    'Parth Mandavia'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin', 
    email = 'parth.mandavia.tristate@gmail.com',
    full_name = 'Parth Mandavia';

-- Step 3: Verify it worked
SELECT * FROM admins;

-- Step 4: Test order access
SELECT id, full_name, email, total_amount, status, created_at 
FROM orders 
ORDER BY created_at DESC 
LIMIT 5;
