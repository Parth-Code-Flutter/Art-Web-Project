import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { order, items } = body;

        // Verify Service Role Key Presence
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('SERVER ERROR: SUPABASE_SERVICE_ROLE_KEY is missing.');
            return NextResponse.json(
                { error: 'Server configuration error. secure_key_missing' },
                { status: 500 }
            );
        }

        // Initialize Admin Client (Bypasses RLS)
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Insert Order
        const { error: orderError } = await supabaseAdmin
            .from('orders')
            .insert([order]);

        if (orderError) {
            console.error('Order Insert Error:', orderError);
            throw orderError;
        }

        // 2. Insert Items
        const { error: itemsError } = await supabaseAdmin
            .from('order_items')
            .insert(items);

        if (itemsError) {
            // In a real app, you might want to rollback the order here
            console.error('Order Items Insert Error:', itemsError);
            // Attempt cleanup
            await supabaseAdmin.from('orders').delete().eq('id', order.id);
            throw itemsError;
        }

        return NextResponse.json({ success: true, orderId: order.id });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
