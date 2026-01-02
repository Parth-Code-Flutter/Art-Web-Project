'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Trash2,
    ArrowRight,
    Loader2,
    Sparkles,
    Image as ImageIcon,
    ChevronLeft,
    Plus,
    CheckCircle
} from 'lucide-react';
import VirtualMockup from '@/components/customer/VirtualMockup';
import ShareModal from '@/components/customer/ShareModal';
import WishlistButton from '@/components/customer/WishlistButton';
import { useWishlist } from '@/contexts/WishlistContext';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function WishlistPage() {
    const { wishlistProducts, removeFromWishlist, loading, wishlistCount } = useWishlist();
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += 1;
        } else {
            currentCart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated'));

        setAddingToCart(product.id);
        setTimeout(() => setAddingToCart(null), 2000);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-24" />
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-8 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <Link
                            href="/customer/products"
                            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Gallery
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                                <Heart size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Your Wishlist</h1>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                                    {wishlistCount} {wishlistCount === 1 ? 'Masterpiece' : 'Masterpieces'} curated for later
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout">
                            {wishlistProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-500 flex flex-col"
                                >
                                    {/* Image Area */}
                                    <Link href={`/customer/products/${product.id}`} className="relative aspect-square overflow-hidden bg-zinc-950 block">
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Quick Remove Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-red-500 hover:border-red-500/30 flex items-center justify-center transition-all z-20 group/remove"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 size={18} className="group-hover/remove:scale-110 transition-transform" />
                                        </button>

                                        {/* Status Tag */}
                                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/70">
                                            Saved
                                        </div>
                                    </Link>

                                    {/* Content Area */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="mb-4">
                                            <Link href={`/customer/products/${product.id}`}>
                                                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                                {product.category}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <div className="flex items-end justify-between pt-4 border-t border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-1">Valuation</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl font-black text-white">
                                                            {formatPrice(product.discount_price || product.price)}
                                                        </span>
                                                        {product.discount_price && (
                                                            <span className="text-xs text-zinc-600 line-through font-bold">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={addingToCart === product.id}
                                                className={`w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all duration-300
                                                    ${addingToCart === product.id
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-white text-black hover:bg-zinc-200'
                                                    }
                                                `}
                                            >
                                                {addingToCart === product.id ? (
                                                    <>
                                                        <CheckCircle size={14} /> Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShoppingBag size={14} /> Add to Cart
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-700">
                                <Heart size={40} strokeWidth={1.5} />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"
                            >
                                <Sparkles size={16} />
                            </motion.div>
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Your collection is empty</h2>
                        <p className="text-zinc-500 max-w-sm mb-10 text-sm leading-relaxed">
                            Explore our curated gallery and save the masterpieces that speak to you. Building a collection takes time.
                        </p>
                        <Link
                            href="/customer/products"
                            className="group px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-3 hover:bg-zinc-200 transition-all hover:scale-105"
                        >
                            Start Exploring
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
