'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Loader2, Image as ImageIcon, SlidersHorizontal, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from './products.module.css';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
    created_at?: string;
}

type SortOption = 'price-high' | 'price-low' | 'date-new' | 'date-old';

export default function CustomerProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>('date-new');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(`.${styles.sortDropdown}`)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        sortProducts();
    }, [sortBy]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortProducts = () => {
        const sorted = [...products].sort((a, b) => {
            const priceA = a.discount_price || a.price;
            const priceB = b.discount_price || b.price;

            switch (sortBy) {
                case 'price-high':
                    return priceB - priceA;
                case 'price-low':
                    return priceA - priceB;
                case 'date-new':
                    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                case 'date-old':
                    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
                default:
                    return 0;
            }
        });
        setProducts(sorted);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <main className={styles.container}>

            {/* Premium Filter Bar */}
            <div className={styles.filterBar}>
                <div className={styles.filterLeft}>
                    <div className={styles.filterIcon}>
                        <SlidersHorizontal size={20} />
                    </div>
                    <span className={styles.filterLabel}>Sort By</span>
                </div>

                <div className={styles.sortDropdown}>
                    <button
                        className={styles.sortTrigger}
                        onClick={() => setIsSortOpen(!isSortOpen)}
                    >
                        {sortBy === 'date-new' && 'Newest First'}
                        {sortBy === 'date-old' && 'Oldest First'}
                        {sortBy === 'price-high' && 'Price: High to Low'}
                        {sortBy === 'price-low' && 'Price: Low to High'}
                        <TrendingDown size={16} className={styles.chevron} />
                    </button>

                    {isSortOpen && (
                        <div className={styles.sortMenu}>
                            <button
                                className={`${styles.sortItem} ${sortBy === 'date-new' ? styles.active : ''}`}
                                onClick={() => { setSortBy('date-new'); setIsSortOpen(false); }}
                            >
                                <Calendar size={16} /> Newest First
                            </button>
                            <button
                                className={`${styles.sortItem} ${sortBy === 'date-old' ? styles.active : ''}`}
                                onClick={() => { setSortBy('date-old'); setIsSortOpen(false); }}
                            >
                                <Calendar size={16} /> Oldest First
                            </button>
                            <button
                                className={`${styles.sortItem} ${sortBy === 'price-high' ? styles.active : ''}`}
                                onClick={() => { setSortBy('price-high'); setIsSortOpen(false); }}
                            >
                                <TrendingDown size={16} /> Price: High to Low
                            </button>
                            <button
                                className={`${styles.sortItem} ${sortBy === 'price-low' ? styles.active : ''}`}
                                onClick={() => { setSortBy('price-low'); setIsSortOpen(false); }}
                            >
                                <TrendingUp size={16} /> Price: Low to High
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className={styles.emptyState}>
                    <Loader2 className="animate-spin" size={40} />
                    <p>Curating the gallery for you...</p>
                </div>
            ) : products.length > 0 ? (
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <Link href={`/customer/products/${product.id}`} key={product.id} className={styles.productCard}>
                            <div className={styles.imageWrapper}>
                                {product.images && product.images.length > 0 ? (
                                    <img src={product.images[0]} alt={product.name} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#cbd5e1' }}>
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className={styles.priceBadge}>
                                    {formatPrice(product.discount_price || product.price)}
                                </div>
                                <div className={styles.categoryBadge}>
                                    {product.category}
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.description}>
                                    {product.description || 'No description available for this masterpiece.'}
                                </p>

                                <div className={styles.cardFooter}>
                                    <span className={styles.viewButton}>
                                        View Details <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <ImageIcon size={64} style={{ opacity: 0.2 }} />
                    <h3>No Artworks Found</h3>
                    <p>The gallery is currently being updated. Please check back soon.</p>
                </div>
            )
            }
        </main >
    );
}
