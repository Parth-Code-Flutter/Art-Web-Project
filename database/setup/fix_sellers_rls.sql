-- Fix RLS Policies for Sellers Table
-- This ensures users can read their own seller profile after login

-- 1. Enable RLS on sellers table (if not already enabled)
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Users can insert own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Users can update own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Public can view approved sellers" ON public.sellers;

-- 3. Create policy: Users can SELECT their own seller record
CREATE POLICY "Users can view own seller profile"
ON public.sellers
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. Create policy: Public can view approved sellers (for artist pages)
CREATE POLICY "Public can view approved sellers"
ON public.sellers
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

-- 5. Create policy: Users can INSERT their own seller record (for registration)
CREATE POLICY "Users can insert own seller profile"
ON public.sellers
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 6. Create policy: Users can UPDATE their own seller record
CREATE POLICY "Users can update own seller profile"
ON public.sellers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 7. CRITICAL: Allow service role to do anything (for triggers and admin)
DROP POLICY IF EXISTS "Service role full access to sellers" ON public.sellers;
CREATE POLICY "Service role full access to sellers"
ON public.sellers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'sellers';
