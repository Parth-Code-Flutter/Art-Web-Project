'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Loader2, Image as ImageIcon, SlidersHorizontal, TrendingUp, TrendingDown, Calendar, ShoppingCart, Plus, Check, Filter } from 'lucide-react';
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
        <main className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
                        Curated Collection
                    </h1>
                    <p className="text-zinc-400 max-w-2xl text-lg">
                        Discover exclusive masterpieces from visionary artists around the globe.
                    </p>
                </header>

                {/* Premium Filter Bar */}
                <div className="sticky top-20 z-40 mb-10">
                    <div className="bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-row flex-wrap items-center justify-between gap-4 shadow-2xl">
                        <div className="flex items-center gap-3 text-zinc-300">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                                <Filter size={20} />
                            </div>
                            <span className="font-medium">{products.length} Artworks</span>
                        </div>

                        <div className="relative sort-dropdown-container w-full sm:w-auto">
                            <button
                                className="w-full sm:w-64 bg-black/40 border border-white/10 hover:border-white/20 text-white px-4 py-3 rounded-xl flex items-center justify-between transition-all"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                <span className="text-sm font-medium">
                                    {sortBy === 'date-new' && 'Newest First'}
                                    {sortBy === 'date-old' && 'Oldest First'}
                                    {sortBy === 'price-high' && 'Price: High to Low'}
                                    {sortBy === 'price-low' && 'Price: Low to High'}
                                </span>
                                <TrendingDown size={16} className={`text-zinc-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-full sm:w-64 bg-[#111] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5"
                                    >
                                        <button
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${sortBy === 'date-new' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                                            onClick={() => { setSortBy('date-new'); setIsSortOpen(false); }}
                                        >
                                            <Calendar size={16} /> Newest First
                                        </button>
                                        <button
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${sortBy === 'date-old' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                                            onClick={() => { setSortBy('date-old'); setIsSortOpen(false); }}
                                        >
                                            <Calendar size={16} /> Oldest First
                                        </button>
                                        <button
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${sortBy === 'price-high' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                                            onClick={() => { setSortBy('price-high'); setIsSortOpen(false); }}
                                        >
                                            <TrendingDown size={16} /> Price: High to Low
                                        </button>
                                        <button
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${sortBy === 'price-low' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                                            onClick={() => { setSortBy('price-low'); setIsSortOpen(false); }}
                                        >
                                            <TrendingUp size={16} /> Price: Low to High
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-zinc-500">
                        <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
                        <p className="text-lg">Curating gallery...</p>
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg">
                                                    {product.category}
                                                </span>
                                            </div>

                                            {/* Overlay Gradient */}
                                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                                            {/* Price Badge */}
                                            <div className="absolute bottom-4 left-4">
                                                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-wide shadow-lg">
                                                    {formatPrice(product.discount_price || product.price)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h3 className="text-xl font-heading font-semibold text-white leading-tight group-hover:text-blue-400 transition-colors">
                                                    {product.name}
                                                </h3>
                                            </div>

                                            <p className="text-zinc-500 text-sm line-clamp-2 mb-6 h-10 leading-relaxed">
                                                {product.description || 'No description available for this masterpiece.'}
                                            </p>

                                            <button
                                                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300
                                                    ${addingToCart === product.id
                                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                        : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
                                                    }
                                                `}
                                                onClick={(e) => handleAddToCart(e, product)}
                                            >
                                                {addingToCart === product.id ? (
                                                    <>
                                                        <Check size={18} /> Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={18} /> Add to Collection
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
                        <h3 className="text-xl font-semibold text-white mb-2">No Artworks Found</h3>
                        <p>The gallery is currently being updated.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
