'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Layers, Loader2, Image as ImageIcon, SlidersHorizontal, TrendingUp, TrendingDown, Calendar, ShoppingCart, Plus, Check, Filter, ChevronLeft, Eye, CheckCircle, Share2 } from 'lucide-react';
import ShareModal from '@/components/customer/ShareModal';
import WishlistButton from '@/components/customer/WishlistButton';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
    quantity: number;
    created_at?: string;
}

type SortOption = 'discount' | 'price-high' | 'price-low' | 'date-new' | 'date-old';

export default function CategoryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    // Decode category from URL safely
    const categoryName = decodeURIComponent(typeof params.category === 'string' ? params.category : '');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<SortOption>('date-new');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const [sharingProduct, setSharingProduct] = useState<Product | null>(null);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.sort-dropdown-container')) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (categoryName) {
            fetchProducts();
        }
    }, [categoryName]);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('category', categoryName)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortedProducts = React.useMemo(() => {
        return [...products].sort((a, b) => {
            const priceA = a.discount_price || a.price;
            const priceB = b.discount_price || b.price;

            switch (sortBy) {
                case 'discount':
                    const discountA = ((a.price - (a.discount_price || a.price)) / a.price);
                    const discountB = ((b.price - (b.discount_price || b.price)) / b.price);
                    return discountB - discountA;
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
    }, [products, sortBy]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();

        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        localStorage.setItem('cart', JSON.stringify([...currentCart, { ...product, quantity: 1 }]));

        // Dispatch custom event to notify header
        window.dispatchEvent(new Event('cartUpdated'));

        // Success state feedback
        setAddingToCart(product.id);
        setTimeout(() => setAddingToCart(null), 2000);
    };

    const handleShare = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        e.stopPropagation();

        const shareData = {
            title: product.name,
            text: `Check out this masterpiece: ${product.name}`,
            url: `${window.location.origin}/customer/products/${product.id}`,
        };

        if (navigator.share) {
            navigator.share(shareData).catch((err) => {
                if (err.name !== 'AbortError') setSharingProduct(product);
            });
        } else {
            setSharingProduct(product);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pt-20 pb-20 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </button>

                {/* Compact Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white border border-zinc-200 dark:bg-white/5 dark:border-white/5 text-blue-600 dark:text-blue-500 shadow-sm dark:shadow-none">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tighter leading-none">{categoryName}</h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{products.length} Masterpieces Found</p>
                        </div>
                    </div>

                    <div className="relative sort-dropdown-container w-full sm:w-auto">
                        <button
                            className="w-full sm:w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 text-zinc-900 dark:text-white px-6 py-4 rounded-2xl flex items-center justify-between transition-all text-[10px] font-black uppercase tracking-widest shadow-sm dark:shadow-none"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-zinc-500" />
                                {sortBy === 'discount' && 'Max Discount'}
                                {sortBy === 'date-new' && 'Newest Arrivals'}
                                {sortBy === 'date-old' && 'Oldest First'}
                                {sortBy === 'price-high' && 'Valuation: High'}
                                {sortBy === 'price-low' && 'Valuation: Low'}
                            </span>
                            <TrendingDown size={14} className={`text-zinc-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-3 w-full sm:w-56 bg-white dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-[2rem] shadow-2xl overflow-hidden z-[60] p-2"
                                >
                                    {[
                                        { id: 'discount', label: 'Max Discount' },
                                        { id: 'date-new', label: 'Newest Arrivals' },
                                        { id: 'date-old', label: 'Oldest First' },
                                        { id: 'price-high', label: 'Valuation: High' },
                                        { id: 'price-low', label: 'Valuation: Low' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt.id ? 'bg-zinc-100 dark:bg-white/10 text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-white/5'}`}
                                            onClick={() => { setSortBy(opt.id as SortOption); setIsSortOpen(false); }}
                                        >
                                            {opt.label}
                                            {sortBy === opt.id && <Check size={12} className="text-blue-500" />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {[...Array(12)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                ) : sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        <AnimatePresence mode="popLayout">
                            {sortedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.03,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <div className="group block bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-[2rem] overflow-hidden hover:border-zinc-300 dark:hover:border-white/10 hover:shadow-xl dark:hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 group">
                                        <Link href={`/customer/products/${product.id}`} className="block">
                                            {/* Image Area */}
                                            <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Empty Visual</span>
                                                    </div>
                                                )}

                                                {/* Wishlist Button */}
                                                <div className="absolute top-3 right-3 z-30">
                                                    <WishlistButton productId={product.id} size="sm" />
                                                </div>

                                                {/* Hover Glow */}
                                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </Link>

                                        {/* Content Area - EXACT ADMIN STYLE */}
                                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                                            <div className="min-w-0">
                                                <Link href={`/customer/products/${product.id}`}>
                                                    <h3 className="font-semibold text-zinc-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                                                        {product.category || 'Uncategorized'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between mt-auto pt-2 border-t border-zinc-100 dark:border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] text-zinc-500 dark:text-zinc-600 uppercase font-black tracking-tighter">Valuation</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-blue-600 dark:text-blue-400 font-black text-xs">{formatPrice(product.discount_price || product.price)}</span>
                                                        {product.discount_price && product.discount_price < product.price && (
                                                            <span className="text-[8px] text-zinc-400 dark:text-zinc-500 line-through font-bold opacity-50">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col">
                                                    <span className="text-[8px] text-zinc-500 dark:text-zinc-600 uppercase font-black tracking-tighter text-right">Discount</span>
                                                    <span className="text-[10px] font-black text-emerald-500">
                                                        {Math.round(((product.price - (product.discount_price || product.price)) / product.price) * 100).toString().padStart(2, '0')}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="pt-2 flex gap-1">
                                                <button
                                                    className={`h-8 rounded-xl flex-1 flex items-center justify-center gap-1 px-2 text-[10px] font-black uppercase tracking-tight transition-all duration-500 whitespace-nowrap
                                                        ${addingToCart === product.id
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                            : 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-white/10'
                                                        }
                                                    `}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    {addingToCart === product.id ? (
                                                        <>
                                                            <CheckCircle size={10} /> Added
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={10} strokeWidth={3} /> Add to Cart
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={(e) => handleShare(e, product)}
                                                    className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                                                >
                                                    <Share2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
                        <ImageIcon size={64} className="mb-6 opacity-20" />
                        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">No Artworks in this Category</h3>
                        <p>We are constantly acting as curators to bring you the best.</p>
                        <button onClick={() => router.push('/customer/products')} className="mt-6 px-6 py-3 bg-zinc-100 dark:bg-white/10 rounded-xl hover:bg-zinc-200 dark:hover:bg-white/20 transition-all text-zinc-900 dark:text-white font-bold">
                            View All Artworks
                        </button>
                    </div>
                )}
            </div>

            <ShareModal
                isOpen={!!sharingProduct}
                onClose={() => setSharingProduct(null)}
                productName={sharingProduct?.name || ''}
                productUrl={sharingProduct ? `${window.location.origin}/customer/products/${sharingProduct.id}` : ''}
            />
        </main>
    );
}
