'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import EmptyStateGraphic from '@/components/EmptyStateGraphic';
import styles from './admin.module.css';

/**
 * Admin Home Page
 * 
 * Fetches products from Supabase and displays an empty state if none are found.
 */
export default function AdminHomePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*');

            if (error) {
                console.error('Error fetching products:', error);
            } else {
                setProducts(data || []);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.emptyState}>
                    <p>Loading products...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Admin Portal</h1>
                {products.length > 0 && (
                    <Link href="/admin/add-product" className={styles.addBtn}>
                        <span>+</span> Add Product
                    </Link>
                )}
            </header>

            {products.length === 0 ? (
                <section className={styles.emptyState}>
                    <div className={styles.graphicContainer}>
                        <EmptyStateGraphic />
                    </div>
                    <h2 className={styles.emptyTitle}>Your Gallery is Empty</h2>
                    <p className={styles.emptySubtitle}>
                        Start sharing your collection with the world by adding your first artwork.
                    </p>
                    <Link href="/admin/add-product" className={styles.addBtn}>
                        <span>+</span> Add Your First Product
                    </Link>
                </section>
            ) : (
                <section>
                    {/* Product list will go here in the next step */}
                    <p>You have {products.length} products.</p>
                </section>
            )}
        </main>
    );
}
