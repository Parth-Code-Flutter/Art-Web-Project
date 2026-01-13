-- Add parth.mandavia.tristate@gmail.com as an admin
-- This user ID is from the orders table: 5c353d04-6049-4bc8-935e-3e8d8a...

-- First, let's get the complete user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'parth.mandavia.tristate@gmail.com';

-- Then insert into admins (replace the ID with the complete one from above query)
INSERT INTO admins (id, email, role, full_name) 
VALUES (
    '5c353d04-6049-4bc8-935e-3e8d8a', -- Replace with FULL ID from query above
    'parth.mandavia.tristate@gmail.com',
    'super_admin',
    'Parth Mandavia'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin';

-- Verify both admins exist
SELECT * FROM admins ORDER BY created_at;
