'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutGrid,
    ShoppingBag,
    Info,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Palette
} from 'lucide-react';
import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
        <header className={styles.headerContainer}>
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
                    <a href="/customer/products" className={styles.navItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingBag size={16} /> Products
                        </div>
                    </a>
                    <a href="/customer/categories" className={styles.navItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <LayoutGrid size={16} /> Category
                        </div>
                    </a>
                    <a href="/about" className={styles.navItem}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={16} /> About Us
                        </div>
                    </a>
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
            </nav>
        </header>
    );
}
