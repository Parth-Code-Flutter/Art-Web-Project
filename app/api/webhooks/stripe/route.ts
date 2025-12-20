import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = await headers();
    const sig = signature.get("stripe-signature");

    if (!sig) {
        return new NextResponse("Webhook Error: Missing signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed.", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const supabase = createClient();

        // Retrieve metadata
        const userId = session.metadata?.user_id;
        const artworkIdsString = session.metadata?.artwork_ids;

        if (userId && artworkIdsString) {
            const artworkIds = JSON.parse(artworkIdsString) as string[];
            const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
            const paymentIntentId = session.payment_intent as string;

            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: userId,
                    total_amount: totalAmount,
                    status: "paid",
                    payment_intent_id: paymentIntentId,
                })
                .select()
                .single();

            if (orderError) {
                console.error("Error creating order:", orderError);
                return new NextResponse("Database Error", { status: 500 });
            }

            // 2. Create Order Items & Update Artwork Status
            for (const artworkId of artworkIds) {
                // Fetch artwork details for price snapshot (optional, but good practice)
                // For MVP, we might skip fetching price if we trust the total, but let's be safe later.
                // Here we just insert the item.

                // Update Artwork Status
                await supabase
                    .from("artworks")
                    .update({ status: "sold" })
                    .eq("id", artworkId);

                // Insert Order Item
                // We need the price... assuming we can get it or just store total for now.
                // Ideally we'd fetch the artwork price again.
                const { data: art } = await supabase.from('artworks').select('price').eq('id', artworkId).single();

                if (art) {
                    await supabase
                        .from("order_items")
                        .insert({
                            order_id: order.id,
                            artwork_id: artworkId,
                            price_at_purchase: art.price,
                        });
                }
            }
        }
    }

    return new NextResponse("Result: OK", { status: 200 });
}
