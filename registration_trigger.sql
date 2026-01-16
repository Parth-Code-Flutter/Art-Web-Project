-- THIS IS THE FIX FOR "NO PROFILE FOUND" ERRORS
-- Run this entire script in your Supabase Dashboard > SQL Editor.

-- 1. Create a secure function to handle new user registration automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check the 'role' metadata (defaults to 'customer' if missing)
  IF new.raw_user_meta_data->>'role' = 'seller' THEN
    
    -- Insert into SELLERS table
    INSERT INTO public.sellers (id, full_name, email, mobile, status, avatar_url)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'name', 'New Artist'),
      new.email,
      new.raw_user_meta_data->>'phone',
      'pending',
      COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    
  ELSE
    
    -- Insert into CUSTOMERS table
    INSERT INTO public.customers (id, full_name, email, mobile, country, avatar_url)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'name', 'New Collector'),
      new.email,
      new.raw_user_meta_data->>'phone',
      COALESCE(new.raw_user_meta_data->>'country', 'IN'),
      COALESCE(new.raw_user_meta_data->>'avatar_url', '')
    );
    
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger the function every time a user signs up via Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- SUCCESS MESSAGE
-- "Trigger setup complete. Profiles will now be auto-created even if verification is enabled."
