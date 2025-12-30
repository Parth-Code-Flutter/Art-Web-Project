import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Use getUser() for better security as it verifies the session with the Supabase server
    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl.clone()

    // 1. CRITICAL: Obfuscate & Protect Vault (Admin) Routes
    if (url.pathname.startsWith('/creovo-admin-dec/vault')) {
        if (!user) {
            const notFoundUrl = new URL('/404', request.url)
            return NextResponse.rewrite(notFoundUrl)
        }

        // Check if user is actually an admin
        const { data: adminData } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .single()

        if (!adminData) {
            // Logged in user but NOT an admin? Show 404 (Obfuscation)
            const notFoundUrl = new URL('/404', request.url)
            return NextResponse.rewrite(notFoundUrl)
        }
    }

    // 2. EXTRA SECURE: Kill the old /admin path completely (Always 404)
    if (url.pathname.startsWith('/admin')) {
        const notFoundUrl = new URL('/404', request.url)
        return NextResponse.rewrite(notFoundUrl)
    }

    // 3. CRITICAL: Protect ALL Customer Routes
    if (url.pathname.startsWith('/customer')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 4. SECURE: Guest-Only Routes
    if (url.pathname === '/login' || url.pathname === '/creovo-admin-dec') {
        if (user) {
            if (url.pathname === '/creovo-admin-dec') {
                return NextResponse.redirect(new URL('/creovo-admin-dec/vault', request.url))
            }
            return NextResponse.redirect(new URL('/customer/dashboard', request.url))
        }
    }

    // 5. CRITICAL: Protect Seller Routes
    if (url.pathname.startsWith('/seller')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check if user is an approved seller
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, status')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'seller' || profile.status !== 'approved') {
            return NextResponse.redirect(new URL('/customer/become-artist', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/creovo-admin-dec/:path*',
        '/admin/:path*',
        '/customer/:path*',
        '/seller/:path*',
        '/login'
    ],
}
