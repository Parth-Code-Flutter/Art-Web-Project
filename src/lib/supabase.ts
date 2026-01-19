import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Check your .env file.');
}

// CRITICAL: Clear ALL corrupted session storage before initializing client
if (typeof window !== 'undefined') {
    try {
        // Clear all Supabase-related localStorage items
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('sb-')) {
                try {
                    const item = localStorage.getItem(key);
                    if (item) {
                        const parsed = JSON.parse(item);
                        // Check if the parsed value is a string (double-encoded) or malformed
                        if (typeof parsed === 'string' || !parsed || typeof parsed !== 'object') {
                            console.warn(`Removing corrupted Supabase key: ${key}`);
                            localStorage.removeItem(key);
                        }
                    }
                } catch (e) {
                    // If parsing fails, the item is definitely corrupt
                    console.warn(`Removing unparseable Supabase key: ${key}`);
                    localStorage.removeItem(key);
                }
            }
        });
    } catch (error) {
        console.error('Error cleaning localStorage:', error);
        // If all else fails, clear everything Supabase-related
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('Failed to clear localStorage:', e);
        }
    }
}

export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: 'pkce'
        }
    }
);
