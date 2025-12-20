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
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check active session
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
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
                        <div className="hidden md:flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                                <User className="w-4 h-4 text-rose-400" />
                                <span className="text-sm font-medium max-w-[100px] truncate">{user.email?.split('@')[0]}</span>
                            </div>
                            <button
                                onClick={handleSignOut}
                                className="text-zinc-400 hover:text-white transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:block text-sm font-medium hover:text-rose-400 transition-colors px-2">
                            Sign In
                        </Link>
                    )}

                    {/* Seller CTA Button */}
                    <Link href="/sell" className="hidden md:flex h-10 px-6 items-center justify-center rounded-full bg-white text-black text-sm font-bold hover:bg-rose-500 hover:text-white transition-all">
                        Start Selling
                    </Link>

                    {/* Mobile Menu Trigger */}
                    <button className="md:hidden p-2 text-white" aria-label="Menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
