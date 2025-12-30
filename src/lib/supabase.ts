import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Check your .env file.');
}

// Helper to clear corrupted session storage
if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const item = localStorage.getItem(key);
            try {
                if (item) {
                    const parsed = JSON.parse(item);
                    // If parsed is a string (double encoded), it's corrupt
                    if (typeof parsed === 'string') {
                        localStorage.removeItem(key);
                        console.warn('Wiping corrupted Supabase session');
                    }
                }
            } catch (e) {
                // If it can't be parsed at all, it's corrupt
                localStorage.removeItem(key);
            }
        }
    });
}

export const supabase = createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
);
