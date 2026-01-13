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
    ShoppingCart,
    Search,
    Heart
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SearchBar from './SearchBar';
import { useWishlist } from '@/contexts/WishlistContext';
import { ThemeToggle } from '../ui/ThemeToggle';

export default function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isProductsHovered, setIsProductsHovered] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [userName, setUserName] = useState<string>('Collector');
    const [userProfileUrl, setUserProfileUrl] = useState<string | null>(null);
    const { wishlistCount } = useWishlist();
    const dropdownRef = useRef<HTMLDivElement>(null);


    // Check if we are on a category page to highlight 'Products'
    const isCategoryPage = pathname.startsWith('/customer/categories');

    // Prevent hydration mismatch and load initial cart count
    useEffect(() => {
        setMounted(true);
        updateCartCount();
        fetchUser();
        fetchCategories();

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

    const fetchCategories = async () => {
        try {
            const { data } = await supabase
                .from('categories')
                .select('id, name')
                .order('name');
            if (data) setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Collector');
                setUserProfileUrl(user.user_metadata?.profile_image_url || null);
            } else {
                setUserName('Collector');
                setUserProfileUrl(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUserName('Collector');
            setUserProfileUrl(null);
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
                setIsProductsHovered(false); // Close mega menu
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
        window.location.href = '/login';
    };

    const navLinks = [
        { name: 'About Us', href: '/customer/about' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 border-b border-transparent
                ${!isHeaderVisible ? '-translate-y-full' : 'translate-y-0'}
                ${lastScrollY > 20 ? 'bg-background/80 backdrop-blur-md border-white/10 shadow-lg' : 'bg-transparent'}
            `}
            >
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 lg:gap-3 cursor-pointer group shrink-0"
                        onClick={() => router.push('/customer/dashboard')}
                    >
                        <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <Palette size={18} className="lg:hidden" />
                            <Palette size={20} className="hidden lg:block" />
                        </div>
                        <span className="text-lg lg:text-xl font-heading font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-white/70 hidden sm:block">
                            ArtGallery
                        </span>
                    </div>

                    {/* Main Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {/* Products Mega Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsProductsHovered(true)}
                            onMouseLeave={() => setIsProductsHovered(false)}
                        >
                            <Link
                                href="/customer/products"
                                className={`flex items-center gap-1 text-sm font-medium tracking-wide transition-colors duration-200 py-4
                                    ${mounted && (pathname.startsWith('/customer/products') || isCategoryPage)
                                        ? 'text-primary'
                                        : 'text-secondary hover:text-primary'
                                    }
                                `}
                            >
                                Products
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isProductsHovered ? 'rotate-180' : ''}`} />
                            </Link>

                            <AnimatePresence>
                                {isProductsHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-64 p-2 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden z-50"
                                    >
                                        <div className="flex flex-col gap-1 p-1">
                                            <Link
                                                href="/customer/products"
                                                className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors group"
                                            >
                                                <span className="text-sm font-semibold text-zinc-900 dark:text-white">Browse All</span>
                                                <ArrowRight size={14} className="text-zinc-400 group-hover:text-primary transition-colors" />
                                            </Link>

                                            <div className="h-px bg-zinc-100 dark:bg-white/10 my-1" />

                                            {isLoadingCategories ? (
                                                <div className="px-4 py-3 text-xs text-zinc-500 text-center">Loading categories...</div>
                                            ) : categories.length > 0 ? (
                                                <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    {categories.map((cat) => (
                                                        <Link
                                                            key={cat.id}
                                                            href={`/customer/categories/${encodeURIComponent(cat.name)}`}
                                                            className="px-4 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                                                        >
                                                            {cat.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-3 text-xs text-zinc-500 text-center">No categories found</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Static Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:text-primary
                                    ${mounted && (pathname === link.href)
                                        ? 'text-primary'
                                        : 'text-secondary'
                                    }
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block flex-1 max-w-md">
                        <SearchBar />
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 lg:gap-4">
                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            <Search size={20} />
                        </button>

                        {/* Wishlist Icon */}
                        <Link href="/customer/wishlist" className="relative p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <Heart size={20} strokeWidth={1.5} className="lg:hidden" />
                            <Heart size={22} strokeWidth={1.5} className="hidden lg:block" />
                            {mounted && wishlistCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Cart Icon */}
                        <Link href="/customer/cart" className="relative p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <ShoppingCart size={20} strokeWidth={1.5} className="lg:hidden" />
                            <ShoppingCart size={22} strokeWidth={1.5} className="hidden lg:block" />
                            {mounted && cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-background">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="hidden md:block w-px h-8 bg-zinc-200 dark:bg-zinc-800" />

                        {/* Profile Section - Desktop */}
                        <div className="relative hidden md:block" ref={dropdownRef}>
                            <button
                                className={`flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border transition-all duration-300 ${isProfileOpen ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'}`}
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                            >
                                <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 overflow-hidden">
                                    {mounted && userProfileUrl ? (
                                        <img src={userProfileUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={14} />
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
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
                                        className="absolute top-full right-0 mt-3 w-64 p-2 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
                                    >
                                        <div className="px-4 py-3 mb-2 border-b border-zinc-100 dark:border-zinc-800/50">
                                            <div className="text-sm font-semibold text-foreground">My Account</div>
                                            <div className="text-xs text-secondary mt-1">Manage your details</div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-secondary hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-left"
                                                onClick={() => { setIsProfileOpen(false); router.push('/customer/settings'); }}
                                            >
                                                <Settings size={16} />
                                                Settings
                                            </button>
                                            <button
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-secondary hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-left"
                                                onClick={() => { setIsProfileOpen(false); router.push('/customer/orders'); }}
                                            >
                                                <ShoppingBag size={16} />
                                                My Orders
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
                            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-background text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/10"
                            onClick={() => router.push('/customer/products')}
                        >
                            Get Started
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Search Modal */}
            <AnimatePresence>
                {isMobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[1002] md:hidden"
                    >
                        <div className="p-4 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-white">Search Artworks</h2>
                                <button
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="p-2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <SearchBar onClose={() => setIsMobileSearchOpen(false)} isMobile />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Navigation Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] transition-opacity duration-300 md:hidden
                    ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-background dark:bg-[#0a0a0a] border-l border-zinc-200 dark:border-zinc-800 z-[1001] transform transition-transform duration-300 md:hidden
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                <Palette size={16} />
                            </div>
                            <span className="text-lg font-heading font-bold">ArtGallery</span>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-secondary hover:text-primary transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                        {/* Profile Summary in Mobile */}
                        {mounted && (userName || userProfileUrl) && (
                            <div className="px-4 py-4 mb-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex items-center gap-4 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-secondary overflow-hidden shrink-0">
                                    {userProfileUrl ? (
                                        <img src={userProfileUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-bold truncate">{userName || 'Collector'}</span>
                                    <span className="text-[10px] text-secondary uppercase font-bold tracking-widest mt-0.5">Active Session</span>
                                </div>
                            </div>
                        )}

                        {/* Mobile Products Accordion */}
                        <div className="flex flex-col">
                            <button
                                onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center justify-between
                                    ${isMobileProductsOpen || pathname.startsWith('/customer/products') || isCategoryPage
                                        ? 'bg-zinc-100 dark:bg-zinc-900 text-primary'
                                        : 'text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                                `}
                            >
                                Products
                                <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isMobileProductsOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-4 pr-2 py-2 flex flex-col gap-1 border-l-2 border-zinc-100 dark:border-zinc-800 ml-4 mt-1">
                                            <Link
                                                href="/customer/products"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex items-center justify-between"
                                            >
                                                Browse All
                                                <ArrowRight size={14} className="text-zinc-400" />
                                            </Link>
                                            {isLoadingCategories ? (
                                                <div className="px-4 py-2 text-xs text-zinc-500">Loading...</div>
                                            ) : categories.length > 0 ? (
                                                categories.map((cat) => (
                                                    <Link
                                                        key={cat.id}
                                                        href={`/customer/categories/${encodeURIComponent(cat.name)}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="px-4 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                                                    >
                                                        {cat.name}
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-xs text-zinc-500">No categories found</div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors
                                    ${pathname === link.href
                                        ? 'bg-zinc-100 dark:bg-zinc-900 text-primary'
                                        : 'text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/customer/wishlist"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-base font-medium text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50 flex justify-between items-center"
                        >
                            My Wishlist
                            {wishlistCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{wishlistCount}</span>}
                        </Link>
                        <Link
                            href="/customer/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-base font-medium text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50 flex justify-between items-center"
                        >
                            My Cart
                            {cartCount > 0 && <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
                        </Link>
                        <Link
                            href="/customer/orders"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-base font-medium text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50 flex items-center gap-3 transition-colors"
                        >
                            <ShoppingBag size={18} className="text-secondary" />
                            My Orders
                        </Link>
                        <Link
                            href="/customer/settings"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center gap-3
                                ${pathname === '/customer/settings'
                                    ? 'bg-zinc-100 dark:bg-zinc-900 text-primary'
                                    : 'text-secondary hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}
                            `}
                        >
                            <Settings size={18} className="text-secondary" />
                            Profile Settings
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                        <button
                            className="w-full py-4 rounded-2xl bg-primary text-background font-bold hover:opacity-90 shadow-xl shadow-primary/5 transition-all active:scale-[0.98]"
                            onClick={() => { setIsMobileMenuOpen(false); router.push('/customer/products'); }}
                        >
                            Get Started
                        </button>
                        <button
                            className="w-full py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-red-500 font-bold hover:bg-red-500/5 hover:border-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
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
