import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
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
            // 1. Ensure profile exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            const userRole = profile?.role || type;

            // 2. Double check role-specific tables
            if (userRole === 'seller') {
                const { data: seller } = await supabase
                    .from('sellers')
                    .select('status')
                    .eq('id', user.id)
                    .single();

                if (!seller) {
                    // Create entry in sellers table if missing
                    await supabase.from('sellers').insert({
                        id: user.id,
                        full_name: user.user_metadata.full_name || user.user_metadata.name || 'New Artist',
                        email: user.email,
                        avatar_url: user.user_metadata.avatar_url,
                        status: 'pending'
                    });
                    return NextResponse.redirect(`${origin}/seller/become-artist`)
                }

                if (seller.status !== 'approved') {
                    return NextResponse.redirect(`${origin}/seller/become-artist`)
                }
            } else {
                const { data: customer } = await supabase
                    .from('customers')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (!customer) {
                    // Create entry in customers table if missing
                    await supabase.from('customers').insert({
                        id: user.id,
                        full_name: user.user_metadata.full_name || user.user_metadata.name || 'New Collector',
                        email: user.email,
                        avatar_url: user.user_metadata.avatar_url,
                    });
                }
            }
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
