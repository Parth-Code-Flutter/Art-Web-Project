import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Check your .env file.');
}

/**
 * Supabase Client
 * 
 * Used for database queries and authentication across the application.
 * Ensure environment variables are set in .env.local.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
