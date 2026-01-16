import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // Robust Origin Detection
    const requestUrl = new URL(request.url)
    let origin = requestUrl.origin;

    // FORCE Live URL if we are visibly on the live domain or running in production with localhost origin
    if (request.url.includes('art-web-project.vercel.app')) {
        origin = 'https://art-web-project.vercel.app';
    } else if (process.env.NODE_ENV === 'production' && origin.includes('localhost')) {
        origin = 'https://art-web-project.vercel.app';
    }

    const { searchParams } = requestUrl
    const code = searchParams.get('code')
    const type = searchParams.get('type') || 'customer'
    // next is a redirect path after the callback, e.g. /customer/dashboard
    const next = searchParams.get('next') ?? (type === 'seller' ? '/seller/dashboard' : '/customer/dashboard')

    if (code) {
        const cookieStore = await cookies()
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )
        const { data: { user }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

        if (!sessionError && user) {
            // DIRECT CHECK: Remove confusion by checking specific tables instead of 'profiles'

            // 1. Check if this is an Arist/Seller
            const { data: seller } = await supabase
                .from('sellers')
                .select('status')
                .eq('id', user.id)
                .maybeSingle();

            // 2. Logic: If found in sellers, they are a seller.
            // If they INTENDED to be a seller (type=seller) but aren't in table, create them.

            if (seller) {
                // Existing Seller
                if (seller.status !== 'approved') {
                    return NextResponse.redirect(`${origin}/seller/become-artist`)
                }
                return NextResponse.redirect(`${origin}/seller/dashboard`)
            } else if (type === 'seller') {
                // New Seller Registration (Google Auth)
                // If not in table but type=seller, create entry
                await supabase.from('sellers').insert({
                    id: user.id,
                    full_name: user.user_metadata.full_name || user.user_metadata.name || 'New Artist',
                    email: user.email,
                    avatar_url: user.user_metadata.avatar_url,
                    status: 'pending'
                });
                return NextResponse.redirect(`${origin}/seller/become-artist`)
            }

            // 3. Defaults to Customer
            const { data: customer } = await supabase
                .from('customers')
                .select('id')
                .eq('id', user.id)
                .maybeSingle();

            if (!customer) {
                // Create Customer Row
                await supabase.from('customers').insert({
                    id: user.id,
                    full_name: user.user_metadata.full_name || user.user_metadata.name || 'New Collector',
                    email: user.email,
                    avatar_url: user.user_metadata.avatar_url,
                });
            }

            return NextResponse.redirect(`${origin}/customer/dashboard`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
