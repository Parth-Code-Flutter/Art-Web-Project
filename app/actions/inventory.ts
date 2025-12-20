"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

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
 * Fetch all artworks for the logged-in seller
 */
export async function getSellerArtworks() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching seller artworks:", error);
        return [];
    }

    return data;
}

/**
 * Delete an artwork (and image from storage)
 */
export async function deleteArtwork(id: string, imageUrl: string) {
    const supabase = await getSupabase();

    // 1. Delete from DB
    const { error: dbError } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

    if (dbError) return { error: dbError.message };

    // 2. Delete from Storage
    // Extract path from public URL
    const path = imageUrl.split('/').pop();
    if (path) {
        await supabase.storage.from('artworks').remove([path]);
    }

    revalidatePath('/sell/dashboard');
    return { success: true };
}

/**
 * Fetch orders that contain artworks from this seller
 */
export async function getSellerOrders() {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    // Fetch order items belonging to this seller's artworks
    const { data: items, error } = await supabase
        .from('order_items')
        .select(`
            *,
            artworks (title, image_url, artist_id),
            orders (id, created_at, status, total_amount, profiles (email, username))
        `)
        .eq('artworks.artist_id', user.id);

    if (error) {
        console.error("Error fetching seller orders:", error);
        return [];
    }

    // Group items by order to show a clean list
    const ordersMap = new Map();

    items?.forEach(item => {
        const orderId = item.orders.id;
        if (!ordersMap.has(orderId)) {
            ordersMap.set(orderId, {
                ...item.orders,
                buyer: item.orders.profiles,
                items: []
            });
        }
        ordersMap.get(orderId).items.push({
            title: item.artworks.title,
            image_url: item.artworks.image_url,
            price: item.price_at_purchase
        });
    });

    return Array.from(ordersMap.values());
}

