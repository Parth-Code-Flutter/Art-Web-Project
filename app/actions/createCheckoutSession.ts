"use server";

import { stripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CookieOptions } from "@supabase/ssr";

type CartItem = {
    id: string; // This is the artwork_id
    title: string;
    price: number;
    image_url: string;
    artist: string;
};

export async function createCheckoutSession(items: CartItem[]) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value; },
                set(name: string, value: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value, ...options }); } catch (error) { }
                },
                remove(name: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value: '', ...options }); } catch (error) { }
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to checkout.");
    }

    if (!items || items.length === 0) {
        throw new Error("Cart is empty.");
    }

    // Create line items for Stripe
    const lineItems = items.map((item) => ({
        price_data: {
            currency: 'usd',
            product_data: {
                name: item.title,
                description: `Artwork by ${item.artist}`,
                images: [item.image_url],
                metadata: {
                    artwork_id: item.id,
                }
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1,
    }));

    // Create Metadata to link session to our DB Order later
    const metadata = {
        user_id: user.id,
        artwork_ids: JSON.stringify(items.map(i => i.id)), // Store all IDs
    };

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cart?canceled=true`,
        metadata: metadata,
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session.");
    }

    redirect(session.url);
}
