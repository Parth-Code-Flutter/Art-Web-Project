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

    // 1. CRITICAL: Protect ALL Admin Routes
    if (url.pathname.startsWith('/admin')) {
        if (!user) {
            // No user? Boot them to login
            return NextResponse.redirect(new URL('/login', request.url))
        }
        // Optional: In a multi-role app, you'd check for an 'admin' flag here
    }

    // 2. CRITICAL: Protect ALL Customer Routes (including categories, products, etc.)
    if (url.pathname.startsWith('/customer')) {
        if (!user) {
            // No user? Boot them to login
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // 3. SECURE: Guest-Only Routes (e.g., don't show login to someone already logged in)
    if (url.pathname === '/login') {
        if (user) {
            // Already logged in? Take them to their workspace
            // We can check metadata to see where they belong, or just default to dashboard
            return NextResponse.redirect(new URL('/customer/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    // Broad matcher to capture all sub-paths of /admin and /customer
    // and also the /login path for the guest guard
    matcher: [
        '/admin/:path*',
        '/customer/:path*',
        '/login'
    ],
}
