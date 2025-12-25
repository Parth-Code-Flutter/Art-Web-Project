'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EmptyStateGraphic from '@/components/EmptyStateGraphic';
import styles from './admin.module.css';

/**
 * Admin Dashboard Page
 * 
 * Features:
 * - Tab navigation between Products and Categories
 * - Data fetching for both tables from Supabase
 * - Empty state handling with animated graphic
 * - Logout functionality
 */
export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    async function fetchData() {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const { data, error } = await supabase.from('products').select('*');
                if (error) throw error;
                setProducts(data || []);
            } else {
                const { data, error } = await supabase.from('categories').select('*');
                if (error) throw error;
                setCategories(data || []);
            }
        } catch (err) {
            console.error(`Error fetching ${activeTab}:`, err);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        // Since we currently use static environment-based auth, 
        // logout simply returns the user to the login screen.
        router.push('/login');
    };

    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.emptyState}>
                    <p>Loading {activeTab}...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            {/* Header with Title and Logout */}
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Portal</h1>
                <div className={styles.navActions}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        Logout
                    </button>
                    {(activeTab === 'products' ? products.length > 0 : categories.length > 0) && (
                        <Link
                            href={activeTab === 'products' ? "/admin/add-product" : "#"}
                            className={styles.addBtn}
                        >
                            <span>+</span> Add {activeTab === 'products' ? 'Product' : 'Category'}
                        </Link>
                    )}
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'products' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Products
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'categories' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Categories
                </button>
            </nav>

            {/* Dashboard Content */}
            <section className={styles.content}>
                {activeTab === 'products' ? (
                    products.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.graphicContainer}>
                                <EmptyStateGraphic />
                            </div>
                            <h2 className={styles.emptyTitle}>No Products Found</h2>
                            <p className={styles.emptySubtitle}>
                                Start your gallery by adding your very first artwork.
                            </p>
                            <Link href="/admin/add-product" className={styles.addBtn}>
                                <span>+</span> Add Your First Product
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            <p>You have {products.length} products published.</p>
                            {/* Detailed listing UI will be implemented in the next phase */}
                        </div>
                    )
                ) : (
                    categories.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.graphicContainer}>
                                <EmptyStateGraphic />
                            </div>
                            <h2 className={styles.emptyTitle}>No Categories Yet</h2>
                            <p className={styles.emptySubtitle}>
                                Group your artworks by creating your first category.
                            </p>
                            <button className={styles.addBtn} onClick={() => console.log('Add Category Modal')}>
                                <span>+</span> Create First Category
                            </button>
                        </div>
                    ) : (
                        <div className={styles.list}>
                            <p>You have {categories.length} categories created.</p>
                        </div>
                    )
                )}
            </section>
        </main>
    );
}
