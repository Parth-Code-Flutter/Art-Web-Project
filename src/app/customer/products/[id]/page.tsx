'use client';

import React, { useEffect, useState, use } from 'react';
import {
    ShoppingBag,
    ArrowLeft,
    Loader2,
    X,
    CreditCard,
    ShieldCheck,
    Truck,
    Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import DashboardHeader from '@/components/customer/DashboardHeader';
import styles from './details.module.css';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
    artist?: string; // We'll add a placeholder if not present
}

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            console.error('Error fetching product:', error);
            router.push('/customer/products');
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

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                    <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                    <p style={{ marginTop: '1rem', color: '#64748b', fontWeight: 500 }}>Preparing masterpiece details...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <main className={styles.container}>
            <DashboardHeader />

            <div className={styles.wrapper}>
                {/* Media Section */}
                <section className={styles.mediaSection}>
                    <button
                        onClick={() => router.back()}
                        style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 600, cursor: 'pointer', marginBottom: '1rem', width: 'max-content' }}
                    >
                        <ArrowLeft size={18} /> Back to Gallery
                    </button>

                    <div className={styles.mainImageContainer} onClick={() => setIsZoomOpen(true)}>
                        <img
                            src={product.images[activeImage]}
                            alt={product.name}
                            className={styles.mainImage}
                        />
                    </div>

                    {product.images.length > 1 && (
                        <div className={styles.thumbnailGrid}>
                            {product.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.thumbnail} ${activeImage === idx ? styles.activeThumbnail : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${idx}`} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Info Section */}
                <section className={styles.infoSection}>
                    <div className={styles.header}>
                        <span className={styles.category}>{product.category}</span>
                        <h1 className={styles.title}>{product.name}</h1>
                        <p className={styles.artist}>Artwork by Curated Artist</p>
                    </div>

                    <div className={styles.priceSection}>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>
                                {formatPrice(product.discount_price || product.price)}
                            </span>
                            {product.discount_price && (
                                <>
                                    <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
                                    <span className={styles.discountBadge}>
                                        {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.8rem' }}>
                            Inclusive of all taxes and shipping insurance.
                        </p>
                    </div>

                    <div className={styles.descriptionSection}>
                        <h3 className={styles.sectionTitle}>Curator's Description</h3>
                        <p className={styles.description}>
                            {product.description || 'This exquisite piece represents a profound exploration of modern aesthetics. Hand-selected for our exclusive collection, it brings a touch of timeless elegance and contemporary vibrance to any space.'}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <ShieldCheck size={20} color="#10b981" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Authenticity Guaranteed</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Truck size={20} color="#3b82f6" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Global Shipping</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <CreditCard size={20} color="#3b82f6" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Secure Payment</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <Clock size={20} color="#f59e0b" />
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Returnable</span>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button className={styles.buyButton}>
                            Acquire Masterpiece <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                        </button>
                        <button className={styles.cartButton}>
                            Add to Private Collection
                        </button>
                    </div>
                </section>
            </div>

            {/* Zoom Modal */}
            {isZoomOpen && (
                <div className={styles.zoomOverlay} onClick={() => setIsZoomOpen(false)}>
                    <div className={styles.closeZoom}>
                        <X size={24} />
                    </div>
                    <img
                        src={product.images[activeImage]}
                        alt={product.name}
                        className={styles.zoomedImage}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </main>
    );
}
