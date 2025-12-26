'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import DashboardHeader from '@/components/customer/DashboardHeader';
import styles from './products.module.css';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
}

export default function CustomerProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <main className={styles.container}>
            <DashboardHeader />

            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', background: '#3b82f61a', borderRadius: '12px', color: '#3b82f6' }}>
                        <ShoppingBag size={20} />
                    </div>
                    <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Gallery
                    </span>
                </div>
                <h1 className={styles.title}>Explore Masterpieces</h1>
                <p className={styles.subtitle}>Discover unique artworks from world-class creators.</p>
            </header>

            {loading ? (
                <div className={styles.emptyState}>
                    <Loader2 className="animate-spin" size={40} />
                    <p>Curating the gallery for you...</p>
                </div>
            ) : products.length > 0 ? (
                <div className={styles.productGrid}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.productCard}>
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
                        </div>
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
