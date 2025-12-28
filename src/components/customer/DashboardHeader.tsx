'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
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
import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch and load initial cart count
    useEffect(() => {
        setMounted(true);
        updateCartCount();

        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);
        window.addEventListener('storage', handleCartUpdate);

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
            window.removeEventListener('storage', handleCartUpdate);
        };
    }, []);

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

    const handleLogout = () => {
        // Clear session logic here later
        router.push('/login');
    };

    return (
        <header className={`${styles.header} ${!isHeaderVisible ? styles.hidden : ''} ${lastScrollY > 50 ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logo} onClick={() => router.push('/customer/dashboard')}>
                    <div className={styles.logoIcon}>
                        <Palette size={24} />
                    </div>
                    <span className={styles.logoText}>ArtGallery</span>
                </div>

                {/* Main Navigation */}
                <nav className={styles.nav}>
                    <div className={styles.navLinks}>
                        <Link
                            href="/customer/products"
                            className={`${styles.navItem} ${mounted && (pathname === '/customer/products' || pathname.startsWith('/customer/products/')) ? styles.active : ''}`}
                        >
                            Products
                        </Link>
                        <Link
                            href="/customer/categories"
                            className={`${styles.navItem} ${mounted && pathname === '/customer/categories' ? styles.active : ''}`}
                        >
                            Categories
                        </Link>
                        <Link href="#" className={styles.navItem}>About Us</Link>
                        <Link href="#" className={styles.navItem}>Artists</Link>
                        <Link href="#" className={styles.navItem}>Exhibitions</Link>
                    </div>
                </nav>

                {/* Right Section */}
                <div className={styles.rightSection}>
                    {/* Cart Icon */}
                    <Link href="/customer/cart" className={styles.cartBtn}>
                        <ShoppingCart size={22} className={styles.cartIcon} />
                        <span className={styles.cartCount}>{cartCount}</span>
                    </Link>

                    <div className={styles.divider} />

                    {/* Profile Section */}
                    <div className={styles.profileSection} ref={dropdownRef}>
                        <div
                            className={styles.profileTrigger}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <User size={20} className={styles.userIcon} />
                            <ChevronDown
                                size={14}
                                className={`${styles.chevron} ${isProfileOpen ? styles.rotate : ''}`}
                            />
                        </div>

                        {isProfileOpen && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>
                                    <strong>My Account</strong>
                                    <span>Manage your details</span>
                                </div>
                                <div className={styles.dropdownItem}>
                                    <Settings size={16} />
                                    <span>Settings</span>
                                </div>
                                <div className={`${styles.dropdownItem} ${styles.logout}`} onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className={styles.ctaButton} onClick={() => router.push('/customer/products')}>
                        Get Started <ArrowRight size={16} />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={styles.menuToggle}
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
                <div className={styles.mobileHeader}>
                    <div className={styles.logo}>
                        <Palette size={24} />
                        <span className={styles.logoText}>ArtGallery</span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)}>
                        <X size={24} />
                    </button>
                </div>
                <div className={styles.mobileLinks}>
                    <Link href="/customer/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
                    <Link href="/customer/categories" onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                    <Link href="/customer/cart" onClick={() => setIsMobileMenuOpen(false)}>My Cart</Link>
                    <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                    <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>Artists</Link>
                    <Link href="#" onClick={() => setIsMobileMenuOpen(false)}>Exhibitions</Link>
                </div>
                <div className={styles.mobileFooter}>
                    <button className={styles.mobileCta} onClick={() => { setIsMobileMenuOpen(false); router.push('/customer/products'); }}>
                        Get Started
                    </button>
                    <button className={styles.mobileLogout} onClick={handleLogout}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div
                className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayVisible : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />
        </header>
    );
}
