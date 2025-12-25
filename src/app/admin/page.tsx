'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    Layers,
    Settings,
    LogOut,
    Plus,
    ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EmptyStateGraphic from '@/components/EmptyStateGraphic';
import styles from './admin.module.css';

interface Product {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

/**
 * Admin Dashboard - Premium Redesign
 * 
 * Objectives:
 * - Proper Sidebar-based Layout
 * - Modern Content Organization
 * - Lucide Icon Integration
 * - Professional Empty States
 */
export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        router.push('/login');
    };

    return (
        <div className={styles.wrapper}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>ArtGallery Admin</div>

                <nav className={styles.nav}>
                    <div
                        className={`${styles.navItem} ${activeTab === 'products' ? styles.activeNavItem : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <ShoppingBag size={20} />
                        <span>Products</span>
                    </div>

                    <div
                        className={`${styles.navItem} ${activeTab === 'categories' ? styles.activeNavItem : ''}`}
                        onClick={() => setActiveTab('categories')}
                    >
                        <Layers size={20} />
                        <span>Categories</span>
                    </div>

                    <div className={styles.navItem}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                </nav>

                <div className={styles.sidebarFooter}>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                {/* Top Bar with Breadcrumbs and Action */}
                <header className={styles.topBar}>
                    <div className={styles.breadcrumb}>
                        <span>Admin</span>
                        <ChevronRight size={14} />
                        <span className={styles.breadcrumbCurrent}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </span>
                    </div>

                    <div className={styles.topActions}>
                        {(activeTab === 'products' ? products.length > 0 : categories.length > 0) && (
                            <Link
                                href={activeTab === 'products' ? "/admin/add-product" : "#"}
                                className={styles.addBtn}
                            >
                                <Plus size={18} />
                                Add {activeTab === 'products' ? 'Product' : 'Category'}
                            </Link>
                        )}
                    </div>
                </header>

                {/* Content Sections */}
                {loading ? (
                    <div className={styles.contentCard}>
                        <p style={{ color: '#666' }}>Synchronizing your data...</p>
                    </div>
                ) : (
                    <section>
                        {activeTab === 'products' ? (
                            products.length === 0 ? (
                                <div className={styles.contentCard}>
                                    <div className={styles.emptyStateGraphic}>
                                        <EmptyStateGraphic />
                                    </div>
                                    <h2 className={styles.emptyTitle}>Your Gallery is Empty</h2>
                                    <p className={styles.emptySubtitle}>
                                        It looks like you haven&apos;t uploaded any masterpieces yet.
                                        Start your collection by adding your first product.
                                    </p>
                                    <Link href="/admin/add-product" className={styles.addBtn}>
                                        <Plus size={18} />
                                        Add Your First Product
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.listContainer}>
                                    <p>Showing {products.length} products</p>
                                    {/* Product Grid implementation goes here */}
                                </div>
                            )
                        ) : (
                            categories.length === 0 ? (
                                <div className={styles.contentCard}>
                                    <div className={styles.emptyStateGraphic}>
                                        <EmptyStateGraphic />
                                    </div>
                                    <h2 className={styles.emptyTitle}>No Categories Defined</h2>
                                    <p className={styles.emptySubtitle}>
                                        Organize your artworks into meaningful groups by
                                        creating your first category.
                                    </p>
                                    <button className={styles.addBtn} onClick={() => console.log('Add Category')}>
                                        <Plus size={18} />
                                        Create First Category
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.listContainer}>
                                    <p>Showing {categories.length} categories</p>
                                </div>
                            )
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
