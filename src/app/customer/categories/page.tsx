'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Package, ArrowRight, Layers } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './categories.module.css';

interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    product_count?: number;
    sample_images?: string[];
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

            // Fetch product counts and sample images for each category
            const categoriesWithCounts = await Promise.all(
                (categoriesData || []).map(async (category) => {
                    // Get count
                    const { count } = await supabase
                        .from('products')
                        .select('*', { count: 'exact', head: true })
                        .eq('category', category.name);

                    // Get up to 4 sample product images
                    const { data: products } = await supabase
                        .from('products')
                        .select('images')
                        .eq('category', category.name)
                        .limit(4);

                    // Extract first image from each product
                    const sampleImages = products
                        ?.map(p => p.images?.[0])
                        .filter(Boolean)
                        .slice(0, 4) || [];

                    return {
                        ...category,
                        product_count: count || 0,
                        sample_images: sampleImages
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

            {loading ? (
                <div className={styles.loadingState}>
                    <Loader2 className="animate-spin" size={40} />
                    <p>Loading categories...</p>
                </div>
            ) : categories.length > 0 ? (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={styles.pageHeader}
                    >
                        <h1 className={styles.title}>Curated Collections</h1>
                        <p className={styles.subtitle}>Explore the finest works across every medium and style</p>
                    </motion.div>

                    <div className={styles.categoryGrid}>
                        <AnimatePresence>
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={`/customer/products?category=${encodeURIComponent(category.name)}`}
                                        className={styles.categoryCard}
                                    >
                                        {/* Category Image/Icon */}
                                        <div className={styles.cardImage}>
                                            {category.sample_images && category.sample_images.length > 0 ? (
                                                <div className={`${styles.imageCollage} ${styles[`grid${category.sample_images.length}`]}`}>
                                                    {category.sample_images.map((img, idx) => (
                                                        <div key={idx} className={styles.collageItem}>
                                                            <img src={img} alt={`${category.name} ${idx + 1}`} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : category.image ? (
                                                <img src={category.image} alt={category.name} className={styles.fullImage} />
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
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
