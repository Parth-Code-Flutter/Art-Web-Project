'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Package, ArrowRight, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DashboardHeader from '@/components/customer/DashboardHeader';
import styles from './categories.module.css';

interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    product_count?: number;
}

export default function CustomerCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            // Fetch all categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (categoriesError) throw categoriesError;

            // Fetch product counts for each category
            const categoriesWithCounts = await Promise.all(
                (categoriesData || []).map(async (category) => {
                    const { count } = await supabase
                        .from('products')
                        .select('*', { count: 'exact', head: true })
                        .eq('category', category.name);

                    return {
                        ...category,
                        product_count: count || 0
                    };
                })
            );

            setCategories(categoriesWithCounts);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={styles.container}>
            <DashboardHeader />

            {/* Header Section */}
            <div className={styles.headerSection}>
                <div className={styles.headerIcon}>
                    <Layers size={24} />
                </div>
                <div>
                    <h1 className={styles.title}>Browse by Category</h1>
                    <p className={styles.subtitle}>Explore our curated collections</p>
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 className="animate-spin" size={40} />
                    <p>Loading categories...</p>
                </div>
            ) : categories.length > 0 ? (
                <div className={styles.categoryGrid}>
                    {categories.map((category) => (
                        <Link
                            href={`/customer/products?category=${encodeURIComponent(category.name)}`}
                            key={category.id}
                            className={styles.categoryCard}
                        >
                            {/* Category Image/Icon */}
                            <div className={styles.cardImage}>
                                {category.image ? (
                                    <img src={category.image} alt={category.name} />
                                ) : (
                                    <div className={styles.placeholderIcon}>
                                        <Package size={48} />
                                    </div>
                                )}
                                <div className={styles.gradientOverlay} />
                            </div>

                            {/* Category Info */}
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.categoryName}>{category.name}</h3>
                                    <div className={styles.countBadge}>
                                        <span className={styles.count}>{category.product_count}</span>
                                        <span className={styles.countLabel}>items</span>
                                    </div>
                                </div>

                                {category.description && (
                                    <p className={styles.description}>{category.description}</p>
                                )}

                                <div className={styles.exploreButton}>
                                    <span>Explore</span>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <Layers size={64} style={{ opacity: 0.2 }} />
                    <h3>No Categories Found</h3>
                    <p>Categories will appear here once they are created.</p>
                </div>
            )}
        </main>
    );
}
