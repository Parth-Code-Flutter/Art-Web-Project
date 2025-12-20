"use server";

import { createClient } from "@/lib/supabase";

export interface Artwork {
    id: string;
    title: string;
    artist_id: string;
    price: number;
    image_url: string;
    category: string;
    profiles?: {
        username: string;
        avatar_url: string;
    };
}

export async function getFeaturedArtworks(): Promise<Artwork[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('artworks')
        .select(`
      id, title, price, image_url, category, artist_id,
      profiles ( username, avatar_url )
    `)
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error("Error fetching artworks:", error);
        return [];
    }

    // Flatten the profile data for easier consumption if needed, 
    // currently we keep structure matching the select.
    return (data as unknown) as Artwork[];
}
