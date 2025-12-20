"use client";

import { Search, Menu, ShoppingBag, User, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

/**
 * Navbar Component
 * 
 * Now integrated with Supabase Auth to show User Profile/Logout.
 */
export function Navbar() {
    const { cartCount } = useCart();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, username')
                    .eq('id', currentUser.id)
                    .single();
                setUserProfile(profile);
            }
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role, username')
                    .eq('id', currentUser.id)
                    .single();
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-serif text-2xl font-bold tracking-tighter group-hover:text-rose-500 transition-colors duration-300">ArtVerse.</span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link href="/explore" className="text-sm font-medium hover:text-rose-400 transition-colors">Explore</Link>
                    <Link href="/artists" className="text-sm font-medium hover:text-rose-400 transition-colors">Artists</Link>
                    <Link href="/collections" className="text-sm font-medium hover:text-rose-400 transition-colors">Collections</Link>
                    <Link href="/blog" className="text-sm font-medium hover:text-rose-400 transition-colors">Journal</Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Trigger */}
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white" aria-label="Search">
                        <Search className="w-5 h-5" />
                    </button>


                    {/* Shopping Cart */}
                    <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white relative" aria-label="Cart">
                        <ShoppingBag className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Logic */}
                    {user ? (
                        <div className="hidden md:flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <Link
                                    href={userProfile?.role === 'seller' ? '/sell/dashboard' : '/dashboard'}
                                    className="text-sm font-bold hover:text-rose-500 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                {userProfile?.username && (
                                    <Link
                                        href={`/artists/${userProfile.username}`}
                                        className="text-[10px] text-zinc-500 hover:text-rose-400 font-mono transition-colors"
                                    >
                                        @{userProfile.username}
                                    </Link>
                                )}
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="p-2 bg-white/5 rounded-full hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/login" className="text-sm font-medium hover:text-rose-400 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/signup" className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all">
                                Join
                            </Link>
                        </div>
                    )}

                    {/* Dynamic CTA */}
                    {!user && (
                        <Link href="/signup?role=seller" className="hidden md:flex h-10 px-6 items-center justify-center rounded-full border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-all">
                            Start Selling
                        </Link>
                    )}

                    {/* Mobile Menu Trigger */}
                    <button className="md:hidden p-2 text-white" aria-label="Menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
