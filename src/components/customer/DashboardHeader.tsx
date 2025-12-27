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
    X
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

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
        <header className={`${styles.headerContainer} ${!isHeaderVisible ? styles.hidden : ''}`}>
            <nav className={styles.floatingNav}>
                {/* Logo */}
                <div className={styles.logo} onClick={() => router.push('/customer/dashboard')}>
                    <div className={styles.avatar} style={{ borderRadius: '12px' }}>
                        <Palette size={20} />
                    </div>
                    <span className={styles.logoText}>ArtGallery</span>
                </div>

                {/* Navigation Links */}
                <div className={styles.navLinks}>
                    <Link
                        href="/customer/products"
                        className={`${styles.navItem} ${mounted && (pathname === '/customer/products' || pathname.startsWith('/customer/products/')) ? styles.active : ''}`}
                    >
                        <ShoppingBag size={16} /> Products
                    </Link>
                    <Link
                        href="/customer/categories"
                        className={`${styles.navItem} ${mounted && pathname === '/customer/categories' ? styles.active : ''}`}
                    >
                        <LayoutGrid size={16} /> Category
                    </Link>
                    <div className={styles.navItem}>
                        <Info size={16} /> About Us
                    </div>
                </div>

                {/* Mobile Menu Trigger */}
                <div
                    className={styles.mobileMenuTrigger}
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={24} color="#0f172a" />
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.open : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Mobile Navigation Drawer */}
                <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.open : ''}`}>
                    <div className={styles.mobileNavHeader}>
                        <div className={styles.logo}>
                            <div className={styles.avatar} style={{ borderRadius: '12px' }}>
                                <Palette size={20} />
                            </div>
                            <span className={styles.logoText}>ArtGallery</span>
                        </div>
                        <div
                            className={styles.closeBtn}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X size={24} color="#64748b" />
                        </div>
                    </div>

                    <div className={styles.mobileLinks}>
                        <Link
                            href="/customer/products"
                            className={`${styles.mobileLink} ${mounted && (pathname === '/customer/products' || pathname.startsWith('/customer/products/')) ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ShoppingBag size={20} /> Products
                        </Link>
                        <Link
                            href="/customer/categories"
                            className={`${styles.mobileLink} ${mounted && pathname === '/customer/categories' ? styles.active : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <LayoutGrid size={20} /> Category
                        </Link>
                        <div className={styles.mobileLink}>
                            <Info size={20} /> About Us
                        </div>
                    </div>

                    <div className={styles.mobileFooter}>
                        <button className={styles.mobileLogout} onClick={handleLogout}>
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>

                {/* Profile Section */}
                <div className={styles.profileSection} ref={dropdownRef}>
                    <div
                        className={styles.profileTrigger}
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className={styles.avatar}>
                            <User size={18} />
                        </div>
                        <span className={styles.userName}>My Profile</span>
                        <ChevronDown
                            size={16}
                            style={{
                                transition: 'transform 0.3s',
                                transform: isProfileOpen ? 'rotate(180deg)' : 'none',
                                color: '#94a3b8'
                            }}
                        />
                    </div>

                    {isProfileOpen && (
                        <div className={styles.dropdown}>
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
            </nav >
        </header >
    );
}
