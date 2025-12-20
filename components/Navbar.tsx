import { Search, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";

/**
 * Navbar Component
 * 
 * A responsive, fixed-position navigation bar.
 * Features:
 * - Glassmorphism effect (backdrop-blur)
 * - Logo with hover effect
 * - Desktop navigation links
 * - Action flow (Search, Cart, Login, Seller CTA)
 * - Mobile menu trigger
 */
export function Navbar() {
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

                    {/* Shopping Cart with Badge */}
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white relative" aria-label="Cart">
                        <ShoppingBag className="w-5 h-5" />
                        {/* Notification Dot */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </button>

                    {/* Login Link */}
                    <Link href="/login" className="hidden md:block text-sm font-medium hover:text-rose-400 transition-colors px-2">
                        Sign In
                    </Link>

                    {/* Seller CTA Button */}
                    <button className="hidden md:flex h-10 px-6 items-center justify-center rounded-full bg-white text-black text-sm font-bold hover:bg-rose-500 hover:text-white transition-all">
                        Start Selling
                    </button>

                    {/* Mobile Menu Trigger */}
                    <button className="md:hidden p-2 text-white" aria-label="Menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
