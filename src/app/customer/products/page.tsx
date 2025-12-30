'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Loader2, Image as ImageIcon, SlidersHorizontal, TrendingUp, TrendingDown, Calendar, ShoppingCart, Plus, Check, Filter, Eye, CheckCircle } from 'lucide-react';
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

type SortOption = 'price-high' | 'price-low' | 'date-new' | 'date-old';

export default function CustomerProducts() {
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
                {/* Compact Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-blue-500">
                            <Filter size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">The Gallery</h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{products.length} Masterpieces Found</p>
                        </div>
                    </div>

                    <div className="relative sort-dropdown-container w-full sm:w-auto">
                        <button
                            className="w-full sm:w-56 bg-zinc-900 border border-white/5 hover:border-white/10 text-white px-6 py-4 rounded-2xl flex items-center justify-between transition-all text-[10px] font-black uppercase tracking-widest"
                            onClick={() => setIsSortOpen(!isSortOpen)}
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-zinc-500" />
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
                                    className="absolute right-0 top-full mt-3 w-full sm:w-56 bg-zinc-900/90 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden z-[60] p-2"
                                >
                                    {[
                                        { id: 'date-new', label: 'Newest Arrivals' },
                                        { id: 'date-old', label: 'Oldest First' },
                                        { id: 'price-high', label: 'Valuation: High' },
                                        { id: 'price-low', label: 'Valuation: Low' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            className={`w-full flex items-center justify-between px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt.id ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
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
                    <div className="flex flex-col items-center justify-center py-40 text-zinc-500">
                        <Loader2 className="animate-spin mb-6 text-blue-500" size={48} />
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Curating The Grid...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        <AnimatePresence mode="popLayout">
                            {products.map((product, index) => (
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
                                    <div className="group block bg-zinc-900/30 border border-white/5 rounded-[2rem] overflow-hidden hover:border-white/10 hover:bg-zinc-900/50 transition-all duration-500 hover:-translate-y-1 group">
                                        <Link href={`/customer/products/${product.id}`} className="block">
                                            {/* Image Area */}
                                            <div className="aspect-square relative overflow-hidden bg-zinc-950">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 bg-zinc-900">
                                                        <ImageIcon size={32} className="mb-2 opacity-50" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50">Empty Visual</span>
                                                    </div>
                                                )}

                                                {/* Discount Badge */}
                                                {product.discount_price && product.discount_price < product.price && (
                                                    <div className="absolute top-3 left-3">
                                                        <div className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 shadow-2xl">
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                                -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hover Glow */}
                                                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                                                {/* Quick View Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                                    <div className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
                                                        <Eye size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Content Area - EXACT ADMIN STYLE */}
                                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                                            <div className="min-w-0">
                                                <Link href={`/customer/products/${product.id}`}>
                                                    <h3 className="font-bold text-white text-xs uppercase tracking-tight line-clamp-1 group-hover:text-blue-400 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                                                    {product.category || 'Uncategorized'}
                                                </p>
                                            </div>

                                            <div className="flex items-end justify-between mt-auto pt-2 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter">Valuation</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-blue-400 font-black text-xs">{formatPrice(product.discount_price || product.price)}</span>
                                                        {product.discount_price && product.discount_price < product.price && (
                                                            <span className="text-[8px] text-zinc-500 line-through font-bold opacity-50">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col">
                                                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter text-right">Stock</span>
                                                    <span className={`text-[10px] font-black ${(product.quantity || 0) > 0 ? 'text-zinc-400' : 'text-red-500'}`}>
                                                        {(product.quantity || 0).toString().padStart(2, '0')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="pt-2">
                                                <button
                                                    className={`w-full h-9 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all duration-500
                                                        ${addingToCart === product.id
                                                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                            : 'bg-white/5 text-white border border-white/5 hover:bg-white/10'
                                                        }
                                                    `}
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                >
                                                    {addingToCart === product.id ? (
                                                        <>
                                                            <CheckCircle size={12} /> Added
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus size={12} strokeWidth={3} /> Add to Cart
                                                        </>
                                                    )}
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
                        <h3 className="text-xl font-semibold text-white mb-2">No Artworks Found</h3>
                        <p>The gallery is currently being updated.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
