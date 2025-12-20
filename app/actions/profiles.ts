"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value, ...options }) } catch (error) { }
                },
                remove(name: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value: '', ...options }) } catch (error) { }
                },
            },
        }
    );
}

/**
 * Fetch a profile and its artworks by username
 */
export async function getArtistByUsername(username: string) {
    const supabase = await getSupabase();

    // 1. Get Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (profileError || !profile) {
        console.error("Profile not found:", profileError);
        return null;
    }

    // 2. Get Artworks
    const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', profile.id)
        .order('created_at', { ascending: false });

    return {
        profile,
        artworks: artworks || []
    };
}

/**
 * Update current user's profile
 */
export async function updateProfile(formData: FormData) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const username = formData.get("username") as string;
    const full_name = formData.get("full_name") as string;
    const bio = formData.get("bio") as string;
    const avatar_url = formData.get("avatar_url") as string;

    const { error } = await supabase
        .from('profiles')
        .update({
            username,
            full_name,
            bio,
            avatar_url,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) return { error: error.message };
    return { success: true };
}
