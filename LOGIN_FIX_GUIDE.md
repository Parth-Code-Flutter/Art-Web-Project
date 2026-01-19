# LOGIN FIX GUIDE - "No customer profile found" Error

## 🔴 Problem
Users get "No customer profile found" error even though their profile exists in the database.

## 🎯 Root Causes
1. **RLS (Row Level Security) policies** blocking SELECT queries on customers/sellers tables
2. **Login logic** was checking only the selected role instead of auto-detecting
3. **Session corruption** from previous OAuth attempts

## ✅ Solutions Applied

### 1. Fixed Login Logic (`src/app/login/page.tsx`)
**What Changed:**
- ✅ Auto-detects user role (checks both sellers and customers tables)
- ✅ No longer requires user to select correct role
- ✅ Better error messages
- ✅ Proper error handling for missing profiles

**Commit:** `44d3712`

### 2. Fixed Supabase Client (`src/lib/supabase.ts`)
**What Changed:**
- ✅ Enhanced localStorage cleanup for corrupted sessions
- ✅ Added PKCE flow configuration
- ✅ Better error handling

**Commit:** `61d0b9e`

### 3. Created RLS Policy Fixes (SQL Scripts)
**Files Created:**
- `database/setup/fix_customers_rls.sql`
- `database/setup/fix_sellers_rls.sql`

**Commit:** `ce51aa7`

## 🚀 IMMEDIATE FIX STEPS

### Step 1: Clear Browser Data
1. Open your browser DevTools (`F12`)
2. Go to **Application** tab → **Local Storage**
3. Delete all keys starting with `sb-`
4. Refresh the page

**OR use this console command:**
```javascript
Object.keys(localStorage).forEach(key => {
  if (key.startsWith('sb-')) localStorage.removeItem(key);
});
location.reload();
```

### Step 2: Fix Database RLS Policies (CRITICAL)
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run `database/setup/fix_customers_rls.sql`:

```sql
-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
DROP POLICY IF EXISTS "Users can insert own customer profile" ON public.customers;
DROP POLICY IF EXISTS "Users can update own customer profile" ON public.customers;

-- Create new policies
CREATE POLICY "Users can view own customer profile"
ON public.customers FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own customer profile"
ON public.customers FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own customer profile"
ON public.customers FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Service role access
CREATE POLICY "Service role full access to customers"
ON public.customers FOR ALL TO service_role
USING (true) WITH CHECK (true);
```

3. Run `database/setup/fix_sellers_rls.sql`:

```sql
-- Enable RLS
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Users can insert own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Users can update own seller profile" ON public.sellers;
DROP POLICY IF EXISTS "Public can view approved sellers" ON public.sellers;

-- Create new policies
CREATE POLICY "Users can view own seller profile"
ON public.sellers FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Public can view approved sellers"
ON public.sellers FOR SELECT TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Users can insert own seller profile"
ON public.sellers FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own seller profile"
ON public.sellers FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Service role access
CREATE POLICY "Service role full access to sellers"
ON public.sellers FOR ALL TO service_role
USING (true) WITH CHECK (true);
```

### Step 3: Restart Dev Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 4: Test Login
1. Go to `http://localhost:3000/login`
2. Enter credentials: `riyev26582@lawicon.com`
3. Click "Access Gallery" or "Enter Studio"
4. Should redirect to dashboard successfully

## 🔍 Verification

After applying fixes, verify:
1. ✅ Login works without "No profile found" error
2. ✅ User is redirected to correct dashboard
3. ✅ No console errors
4. ✅ Session persists on page refresh

## 📊 What Each Fix Does

### Login Logic Fix
- **Before:** Checked only the role user selected (customer/seller)
- **After:** Checks both tables automatically, redirects to correct dashboard

### RLS Policy Fix
- **Before:** Policies might have been missing or too restrictive
- **After:** Authenticated users can read/write their own profiles

### Session Cleanup
- **Before:** Corrupted OAuth sessions caused errors
- **After:** Auto-cleans corrupted sessions on page load

## 🆘 If Still Not Working

### Check RLS Policies in Supabase
1. Go to **Supabase Dashboard** → **Table Editor** → **customers**
2. Click **RLS** tab
3. Verify policies exist and are enabled

### Check User ID Match
1. Go to **Authentication** → **Users**
2. Copy the user's ID
3. Go to **Table Editor** → **customers**
4. Verify the ID exists in the table

### Check Console for Errors
1. Open DevTools (`F12`) → **Console**
2. Look for Supabase errors
3. Share error messages if issue persists

## 📝 Summary

**Files Modified:**
- `src/app/login/page.tsx` - Improved login logic
- `src/lib/supabase.ts` - Fixed session handling

**Files Created:**
- `database/setup/fix_customers_rls.sql` - RLS policies for customers
- `database/setup/fix_sellers_rls.sql` - RLS policies for sellers

**Commits:**
- `44d3712` - Fix login logic
- `61d0b9e` - Fix Supabase client
- `ce51aa7` - Add RLS policy fixes

---

**Status:** ✅ Ready to test
**Priority:** 🔴 CRITICAL - Run SQL scripts immediately
