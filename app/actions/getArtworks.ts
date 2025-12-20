"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Helper to create server-side client
async function createServerSideClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // The `delete` method was called from a Server Component.
                    }
                },
            },
        }
    )
}

export interface Artwork {
    id: string;
    title: string;
    description?: string;
    artist_id: string;
    price: number;
    image_url: string;
    category: string;
    width?: number;
    height?: number;
    tags?: string[];
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
    const supabase = await createServerSideClient();

    const { data, error } = await supabase
        .from('artworks')
        .select(`
      id, title, price, image_url, category, artist_id,
      profiles ( username, avatar_url )
    `)
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error("Error fetching featured artworks:", error);
        return [];
    }

    return (data as unknown) as Artwork[];
}

export async function getAllArtworks(query?: string, category?: string): Promise<Artwork[]> {
    const supabase = await createServerSideClient();

    let dbQuery = supabase
        .from('artworks')
        .select(`
          id, title, price, image_url, category, artist_id,
          profiles ( username, avatar_url )
        `)
        .order('created_at', { ascending: false });

    // Apply Text Search Filter
    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`);
    }

    // Apply Category Filter
    if (category && category !== 'All') {
        dbQuery = dbQuery.eq('category', category);
    }

    const { data, error } = await dbQuery;

    if (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }

    return (data as unknown) as Artwork[];
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
    const supabase = await createServerSideClient();

    const { data, error } = await supabase
        .from('artworks')
        .select(`
          *,
          profiles ( username, avatar_url )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching artwork by id:", error);
        return null;
    }

    return (data as unknown) as Artwork;
}
