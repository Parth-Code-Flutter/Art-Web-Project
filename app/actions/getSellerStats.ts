"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CookieOptions } from "@supabase/ssr";

export async function getSellerStats() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle cookie setting error
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Handle cookie removal error
                    }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 1. Get Active Listings
    const { count: activeListings } = await supabase
        .from("artworks")
        .select("*", { count: "exact", head: true })
        .eq("artist_id", user.id)
        .eq("status", "available");

    // 2. Get Total Earnings & Orders (via order_items)
    // We need to join order_items -> artworks to filter by artist_id
    const { data: soldItems } = await supabase
        .from("order_items")
        .select(`
      price_at_purchase,
      artworks!inner(artist_id)
    `)
        .eq("artworks.artist_id", user.id);

    const totalEarnings = soldItems?.reduce((acc, item) => acc + (Number(item.price_at_purchase) || 0), 0) || 0;

    // 3. Get Orders to Ship (Count distinct orders containing my art that are 'paid' but not 'shipped')
    // This is a bit complex in one query, simplifying to sold items count for now or checking 'orders' status if we add seller_status to items
    const ordersToShip = soldItems?.length || 0; // Simplified for MVP: Total Items Sold

    return {
        earnings: totalEarnings,
        activeListings: activeListings || 0,
        ordersToShip: ordersToShip // Placeholder: needs more complex query for actual shipping status per item
    };
}
