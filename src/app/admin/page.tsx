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
    ChevronRight,
    Eye,
    Pencil,
    Trash2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EmptyStateGraphic from '@/components/EmptyStateGraphic';
import CategoryModal from '@/components/CategoryModal';
import styles from './admin.module.css';

interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category: string;
    images: string[];
}

interface Category {
    id: string;
    name: string;
    image_url: string;
    created_at: string;
}

/**
 * Admin Dashboard - Premium Redesign
 * 
 * Objectives:
 * - Proper Sidebar-based Layout
 * - Modern Content Organization
 * - Lucide Icon Integration
 * - Professional Empty States
 * - Table Listing for Products/Categories
 */
export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    async function fetchData() {
        setLoading(true);
        try {
            if (activeTab === 'products') {
                const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setProducts(data || []);
            } else {
                const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
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

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error deleting category');
        }
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
                            activeTab === 'products' ? (
                                <Link href="/admin/add-product" className={styles.addBtn}>
                                    <Plus size={18} />
                                    Add Product
                                </Link>
                            ) : (
                                <button className={styles.addBtn} onClick={() => setIsCategoryModalOpen(true)}>
                                    <Plus size={18} />
                                    Add Category
                                </button>
                            )
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
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th className={styles.th}>Product</th>
                                                    <th className={styles.th}>Category</th>
                                                    <th className={styles.th}>Price</th>
                                                    <th className={styles.th}>Stock</th>
                                                    <th className={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id}>
                                                        <td className={styles.td}>
                                                            <div className={styles.categoryCell}>
                                                                <img src={product.images[0] || '/placeholder-art.jpg'} className={styles.categoryImg} alt={product.name} />
                                                                <span>{product.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className={styles.td}>{product.category}</td>
                                                        <td className={styles.td}>${product.price}</td>
                                                        <td className={styles.td}>{product.quantity}</td>
                                                        <td className={styles.td}>
                                                            <div className={styles.actionBtns}>
                                                                <button className={`${styles.actionIcon} ${styles.viewIcon}`} title="View"><Eye size={16} /></button>
                                                                <button className={`${styles.actionIcon} ${styles.editIcon}`} title="Edit"><Pencil size={16} /></button>
                                                                <button className={`${styles.actionIcon} ${styles.deleteIcon}`} title="Delete"><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                                    <button className={styles.addBtn} onClick={() => setIsCategoryModalOpen(true)}>
                                        <Plus size={18} />
                                        Create First Category
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.listContainer}>
                                    <div className={styles.tableContainer}>
                                        <table className={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th className={styles.th}>Category Name</th>
                                                    <th className={styles.th}>Created At</th>
                                                    <th className={styles.th}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categories.map((cat) => (
                                                    <tr key={cat.id}>
                                                        <td className={styles.td}>
                                                            <div className={styles.categoryCell}>
                                                                <img src={cat.image_url || '/placeholder-category.jpg'} className={styles.categoryImg} alt={cat.name} />
                                                                <span style={{ fontWeight: 600 }}>{cat.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className={styles.td}>
                                                            {new Date(cat.created_at).toLocaleDateString()}
                                                        </td>
                                                        <td className={styles.td}>
                                                            <div className={styles.actionBtns}>
                                                                <button className={`${styles.actionIcon} ${styles.viewIcon}`} title="View"><Eye size={16} /></button>
                                                                <button className={`${styles.actionIcon} ${styles.editIcon}`} title="Edit"><Pencil size={16} /></button>
                                                                <button
                                                                    className={`${styles.actionIcon} ${styles.deleteIcon}`}
                                                                    title="Delete"
                                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        )}
                    </section>
                )}

                {/* Modals */}
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSuccess={fetchData}
                />
            </main>
        </div>
    );
}
