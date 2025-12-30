'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Loader2, Image as ImageIcon, SlidersHorizontal, TrendingUp, TrendingDown, Calendar, ShoppingCart, Plus, Check, Filter, ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

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

    useEffect(() => {
        sortProducts();
    }, [sortBy]);

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

    return (
        <main className="min-h-screen bg-black pt-20 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </button>

                {/* Compact Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                        <Filter size={16} />
                        <span>{products.length} Artworks Found</span>
                    </div>

                    <div className="relative sort-dropdown-container w-full sm:w-auto">
                        <button
                            className="w-full sm:w-48 bg-zinc-900 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-between transition-all text-xs font-bold uppercase tracking-wider"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                        >
                            <span>
                                {sortBy === 'date-new' && 'Newest'}
                                {sortBy === 'date-old' && 'Oldest'}
                                {sortBy === 'price-high' && 'Price: High'}
                                {sortBy === 'price-low' && 'Price: Low'}
                            </span>
                            <TrendingDown size={14} className={`text-zinc-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isSortOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-full sm:w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 p-1"
                                >
                                    {[
                                        { id: 'date-new', label: 'Newest' },
                                        { id: 'date-old', label: 'Oldest' },
                                        { id: 'price-high', label: 'Price: High' },
                                        { id: 'price-low', label: 'Price: Low' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${sortBy === opt.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                                            onClick={() => { setSortBy(opt.id as SortOption); setIsSortOpen(false); }}
                                        >
                                            {opt.label}
                                            {sortBy === opt.id && <Check size={12} />}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
                        <p className="text-lg">Curating {categoryName} collection...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.05,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    viewport={{ once: true }}
                                >
                                    <Link href={`/customer/products/${product.id}`} className="group block bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 hover:bg-zinc-900/50 transition-all duration-300 hover:-translate-y-2">
                                        {/* Image Area */}
                                        <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900">
                                            {product.images && product.images.length > 0 ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-800/50">
                                                    <ImageIcon size={48} className="mb-2 opacity-50" />
                                                    <span className="text-xs font-medium uppercase tracking-widest opacity-50">No Image</span>
                                                </div>
                                            )}

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white shadow-lg uppercase tracking-wider">
                                                    {product.category}
                                                </span>
                                            </div>

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                            {/* Price Badge */}
                                            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                                <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-sm tracking-wide shadow-lg">
                                                    {formatPrice(product.discount_price || product.price)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-4">
                                            <div className="mb-4 h-12 flex items-center">
                                                <h3 className="text-sm md:text-base font-heading font-bold text-white leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <button
                                                className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider transition-all duration-300
                                                    ${addingToCart === product.id
                                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                        : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
                                                    }
                                                `}
                                                onClick={(e) => handleAddToCart(e, product)}
                                            >
                                                {addingToCart === product.id ? (
                                                    <>
                                                        <Check size={14} strokeWidth={3} /> Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={14} strokeWidth={3} /> Add
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-600">
                        <ImageIcon size={64} className="mb-6 opacity-20" />
                        <h3 className="text-xl font-semibold text-white mb-2">No Artworks in this Category</h3>
                        <p>We are constantly acting as curators to bring you the best.</p>
                        <button onClick={() => router.push('/customer/products')} className="mt-6 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-white font-bold">
                            View All Artworks
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
