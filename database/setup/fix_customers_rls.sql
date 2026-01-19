-- Fix RLS Policies for Customers Table
-- This ensures users can read their own customer profile after login

-- 1. Enable RLS on customers table (if not already enabled)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
DROP POLICY IF EXISTS "Users can insert own customer profile" ON public.customers;
DROP POLICY IF EXISTS "Users can update own customer profile" ON public.customers;

-- 3. Create policy: Users can SELECT their own customer record
CREATE POLICY "Users can view own customer profile"
ON public.customers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. Create policy: Users can INSERT their own customer record (for registration)
CREATE POLICY "Users can insert own customer profile"
ON public.customers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 5. Create policy: Users can UPDATE their own customer record
CREATE POLICY "Users can update own customer profile"
ON public.customers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. CRITICAL: Allow service role to do anything (for triggers)
DROP POLICY IF EXISTS "Service role full access to customers" ON public.customers;
CREATE POLICY "Service role full access to customers"
ON public.customers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'customers';
