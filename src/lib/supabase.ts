import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Check your .env file.');
}

/**
 * Supabase Client (Browser)
 * 
 * Used for database queries and authentication across the application.
 * Using createBrowserClient from @supabase/ssr ensures that cookies
 * are correctly handled for middleware compatibility.
 */
export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
);
