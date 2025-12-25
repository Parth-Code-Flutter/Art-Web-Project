'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CustomerAuth from '@/components/customer/CustomerAuth';
import styles from './login.module.css';

/**
 * Main Login Page
 * 
 * Features:
 * - Admin Login (Static + Supabase check placeholder)
 * - Customer Explore Gallery (Premium Modal Entry)
 */
export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<'selection' | 'admin'>('selection');
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    // Admin Login Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Customer Auth State
    const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdminLoading(true);

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPass) {
            router.push('/admin');
        } else {
            alert('Invalid Admin Credentials');
        }
        setIsAdminLoading(false);
    };

    return (
        <main className={styles.container}>
            <div className={styles.glassCard}>
                <header className={styles.header}>
                    <h1 className={styles.title}>ArtGallery</h1>
                    <p className={styles.subtitle}>Curating Masterpieces for the Discerning Collector</p>
                </header>

                {view === 'selection' ? (
                    <div className={styles.selectionGrid}>
                        <div className={styles.card} onClick={() => setIsCustomerAuthOpen(true)}>
                            <div className={styles.iconBox}>
                                <ShoppingBag size={32} />
                            </div>
                            <h2>Explore Gallery</h2>
                            <p>Discover and purchase exclusive artworks</p>
                            <ArrowRight className={styles.arrow} />
                        </div>

                        <div className={styles.card} onClick={() => setView('admin')}>
                            <div className={styles.iconBox}>
                                <LayoutDashboard size={32} />
                            </div>
                            <h2>Admin Portal</h2>
                            <p>Manage your gallery and inventory</p>
                            <ArrowRight className={styles.arrow} />
                        </div>
                    </div>
                ) : (
                    <div className={styles.adminFormContainer}>
                        <button className={styles.backBtn} onClick={() => setView('selection')}>
                            ← Back to selection
                        </button>

                        <form className={styles.form} onSubmit={handleAdminLogin}>
                            <div className={styles.inputGroup}>
                                <label>Admin Email</label>
                                <input
                                    type="email"
                                    placeholder="admin@artgallery.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={isAdminLoading}>
                                {isAdminLoading ? 'Authenticating...' : 'Secure Login'}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Customer Authentication Modal */}
            <CustomerAuth
                isOpen={isCustomerAuthOpen}
                onClose={() => setIsCustomerAuthOpen(false)}
            />

            <footer className={styles.footer}>
                © {new Date().getFullYear()} ArtGallery Inc. All rights reserved.
            </footer>
        </main>
    );
}
