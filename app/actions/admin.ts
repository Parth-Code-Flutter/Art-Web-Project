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
                        // Ignored
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Ignored
                    }
                },
            },
        }
    )
}

export interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    activeArtworks: number;
    avgOrderValue: number;
}

export async function getAdminStats(): Promise<AdminStats> {
    const supabase = await createServerSideClient();

    // 1. Get Total Orders & Revenue
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount');

    if (ordersError) {
        console.error("Error fetching admin stats (orders):", ordersError);
    }

    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // 2. Get Active Artworks
    const { count: activeArtworks, error: artError } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

    if (artError) {
        console.error("Error fetching admin stats (artworks):", artError);
    }

    return {
        totalRevenue,
        totalOrders,
        activeArtworks: activeArtworks || 0,
        avgOrderValue
    };
}
