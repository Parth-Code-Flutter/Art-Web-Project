'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutGrid,
    ShoppingBag,
    Info,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Palette,
    Menu,
    X,
    ArrowRight,
    ShoppingCart
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [userName, setUserName] = useState<string>('Collector');
    const [userProfileUrl, setUserProfileUrl] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch and load initial cart count
    useEffect(() => {
        setMounted(true);
        updateCartCount();
        fetchUser();

        const handleCartUpdate = () => updateCartCount();
        const handleLoginUpdate = () => fetchUser();

        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);
        window.addEventListener('customerLogin', handleLoginUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
            window.removeEventListener('customerLogin', handleLoginUpdate);
        };
    }, []);

    const fetchUser = async () => {
        // 1. Check Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Collector');
            setUserProfileUrl(user.user_metadata?.profile_image_url || null);
            return;
        }

        // 2. Fallback to Custom Local Session
        if (typeof window !== 'undefined') {
            const customUser = JSON.parse(localStorage.getItem('customer_user') || 'null');
            if (customUser) {
                setUserName(customUser.full_name || 'Collector');
                setUserProfileUrl(customUser.profile_image_url || null);
            } else {
                setUserName('Collector');
                setUserProfileUrl(null);
            }
        }
    };

    const updateCartCount = () => {
        if (typeof window !== 'undefined') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        }
    };

    // Handle scroll to show/hide header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header when at top
            if (currentScrollY < 10) {
                setIsHeaderVisible(true);
            }
            // Hide when scrolling down, show when scrolling up
            else if (currentScrollY > lastScrollY) {
                setIsHeaderVisible(false);
                setIsProfileOpen(false); // Close profile when scrolling down
            } else {
                setIsHeaderVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('customer_user');
        router.push('/login');
    };

    const navLinks = [
        { name: 'Products', href: '/customer/products' },
        { name: 'Categories', href: '/customer/categories' },
        { name: 'About Us', href: '#' },
        { name: 'Artists', href: '#' },
        { name: 'Exhibitions', href: '#' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 border-b border-transparent
                ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}
                ${lastScrollY > 20 ? 'bg-background/80 backdrop-blur-md border-white/10 shadow-lg' : 'bg-transparent'}
            `}
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push('/customer/dashboard')}
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <Palette size={20} />
                        </div>
                        <span className="text-xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                            ArtGallery
                        </span>
                    </div>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-white
                                    ${mounted && (pathname === link.href || (link.href !== '#' && pathname.startsWith(link.href)))
                                        ? 'text-white'
                                        : 'text-zinc-400'
                                    }
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        {/* Cart Icon */}
                        <Link href="/customer/cart" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                            <ShoppingCart size={22} strokeWidth={1.5} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="hidden md:block w-px h-8 bg-zinc-800" />

                        {/* Profile Section */}
                        <div className="relative hidden md:block" ref={dropdownRef}>
                            <button
                                className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition-all duration-300 ${isProfileOpen ? 'bg-zinc-800 border-zinc-700' : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-700'}`}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 overflow-hidden">
                                    {mounted && userProfileUrl ? (
                                        <img src={userProfileUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={14} />
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-zinc-300">
                                    {mounted ? userName : '...'}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-zinc-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-3 w-64 p-2 rounded-2xl bg-[#0a0a0a] border border-zinc-800 shadow-2xl overflow-hidden"
                                    >
                                        <div className="px-4 py-3 mb-2 border-b border-zinc-800/50">
                                            <div className="text-sm font-semibold text-white">My Account</div>
                                            <div className="text-xs text-zinc-500 mt-1">Manage your details</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors text-left"
                                                onClick={() => { setIsProfileOpen(false); router.push('/customer/settings'); }}
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </button>
                                            <button
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                                                onClick={handleLogout}
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* CTA Button */}
                        <button
                            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
                            onClick={() => router.push('/customer/products')}
                        >
                            Get Started
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 md:hidden
                    ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-[#0a0a0a] border-l border-zinc-800 z-[1001] transform transition-transform duration-300 md:hidden
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                <Palette size={16} />
                            </div>
                            <span className="text-lg font-heading font-bold text-white">ArtGallery</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        {/* Profile Summary in Mobile */}
                        {mounted && (userName || userProfileUrl) && (
                            <div className="px-4 py-4 mb-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 overflow-hidden shrink-0">
                                    {userProfileUrl ? (
                                        <img src={userProfileUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold text-white truncate">{userName || 'Collector'}</span>
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mt-0.5">Active Session</span>
                                </div>
                            </div>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors
                                    ${pathname === link.href
                                        ? 'bg-zinc-900 text-white'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/customer/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-900/50 flex justify-between items-center"
                        >
                            My Cart
                            {cartCount > 0 && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                        </Link>
                        <Link
                            href="/customer/settings"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3
                                ${pathname === '/customer/settings'
                                    ? 'bg-zinc-900 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}
                            `}
                        >
                            <Settings size={18} className="text-zinc-500" />
                            Profile Settings
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <button
                            className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 shadow-xl shadow-white/5 transition-all active:scale-[0.98]"
                            onClick={() => { setIsMobileMenuOpen(false); router.push('/customer/products'); }}
                        >
                            Get Started
                        </button>
                        <button
                            className="w-full py-4 rounded-2xl border border-zinc-800 text-red-400 font-bold hover:bg-red-500/5 hover:border-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
