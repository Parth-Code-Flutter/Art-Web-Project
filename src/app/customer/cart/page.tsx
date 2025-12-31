'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShieldCheck,
    ShoppingBasket,
    ChevronLeft,
    Package,
    Sparkles,
    Tag,
    X
} from 'lucide-react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    images: string[];
    category: string;
    quantity: number;
}

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadCart();

        // Listen for cart updates from other components
        const handleCartUpdate = () => loadCart();
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const consolidated = savedCart.reduce((acc: CartItem[], item: any) => {
            const existing = acc.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += (item.quantity || 1);
            } else {
                acc.push({ ...item, quantity: item.quantity || 1 });
            }
            return acc;
        }, []);
        setCartItems(consolidated);
    };

    const updateQuantity = (id: string, delta: number) => {
        const updated = cartItems.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        saveCart(updated);
    };

    const removeItem = (id: string) => {
        const updated = cartItems.filter(item => item.id !== id);
        saveCart(updated);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);
    const totalSavings = cartItems.reduce((sum, item) => {
        if (item.discount_price) {
            return sum + (item.price - item.discount_price) * item.quantity;
        }
        return sum;
    }, 0);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-black text-white pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Cart Items Section - 2/3 width on desktop */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <Link
                                    href="/customer/products"
                                    className="inline-flex items-center text-zinc-500 hover:text-white transition-colors group text-sm font-medium"
                                >
                                    <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                    Continue Shopping
                                </Link>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                            Your Collection
                                        </h1>
                                        <p className="text-zinc-500 mt-1 text-sm">
                                            {totalItems} {totalItems === 1 ? 'artwork' : 'artworks'} • {cartItems.length} {cartItems.length === 1 ? 'unique piece' : 'unique pieces'}
                                        </p>
                                    </div>

                                    {cartItems.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium border border-red-500/20"
                                        >
                                            <Trash2 size={16} />
                                            Clear All
                                        </button>
                                    )}
                                </div>
                            </motion.div>

                            {/* Cart Items List - Scrollable Container */}
                            <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                layout: { duration: 0.3 }
                                            }}
                                            className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-zinc-900/60 transition-all"
                                        >
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />

                                            <div className="relative p-4 flex gap-4">
                                                {/* Product Image */}
                                                <Link
                                                    href={`/customer/products/${item.id}`}
                                                    className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-zinc-800 group/img"
                                                >
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                                    />
                                                    {item.discount_price && (
                                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wide">
                                                            {Math.round(((item.price - item.discount_price) / item.price) * 100)}% OFF
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-2 mb-1">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                                                                    {item.category}
                                                                </p>
                                                                <Link href={`/customer/products/${item.id}`}>
                                                                    <h3 className="font-semibold text-white hover:text-blue-400 transition-colors line-clamp-1 text-sm sm:text-base">
                                                                        {item.name}
                                                                    </h3>
                                                                </Link>
                                                            </div>

                                                            {/* Remove Button - Desktop */}
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="hidden sm:flex shrink-0 w-8 h-8 items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                                title="Remove"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="flex items-baseline gap-2 mt-2">
                                                            <span className="text-lg font-bold text-white">
                                                                {formatPrice(item.discount_price || item.price)}
                                                            </span>
                                                            {item.discount_price && (
                                                                <span className="text-sm text-zinc-500 line-through">
                                                                    {formatPrice(item.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between mt-3">
                                                        <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-sm font-bold w-8 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-7 h-7 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        {/* Item Total */}
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider">Subtotal</p>
                                                            <p className="text-base font-bold text-white">
                                                                {formatPrice((item.discount_price || item.price) * item.quantity)}
                                                            </p>
                                                        </div>

                                                        {/* Remove Button - Mobile */}
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Clear Button */}
                            <button
                                onClick={clearCart}
                                className="md:hidden w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium border border-red-500/20"
                            >
                                <Trash2 size={16} />
                                Clear All Items
                            </button>
                        </div>

                        {/* Order Summary - 1/3 width on desktop, sticky */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-24 space-y-4">
                                {/* Summary Card */}
                                <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Package className="text-blue-400" size={20} />
                                        <h2 className="text-xl font-bold text-white">Order Summary</h2>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Subtotal ({totalItems} items)</span>
                                            <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
                                        </div>

                                        {totalSavings > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-zinc-400 flex items-center gap-1">
                                                    <Tag size={14} />
                                                    Total Savings
                                                </span>
                                                <span className="text-emerald-400 font-bold">-{formatPrice(totalSavings)}</span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-sm">
                                            <span className="text-zinc-400">Shipping</span>
                                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                                <Sparkles size={12} />
                                                Free
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-medium text-white">Total</span>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-white">
                                                    {formatPrice(subtotal)}
                                                </p>
                                                {totalSavings > 0 && (
                                                    <p className="text-xs text-emerald-400 font-medium">
                                                        You save {formatPrice(totalSavings)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-lg shadow-white/10 group mb-4">
                                        Proceed to Checkout
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span>Secure SSL Encrypted Payment</span>
                                    </div>
                                </div>

                                {/* Benefits Card */}
                                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-3">
                                    <h3 className="text-sm font-bold text-white mb-3">Why Buy From Us?</h3>
                                    {[
                                        { icon: ShieldCheck, text: 'Authenticity Guaranteed', color: 'text-emerald-400' },
                                        { icon: Package, text: 'Insured Global Shipping', color: 'text-blue-400' },
                                        { icon: Sparkles, text: '30-Day Return Policy', color: 'text-purple-400' }
                                    ].map((benefit, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <benefit.icon size={16} className={benefit.color} />
                                            <span className="text-zinc-300">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 min-h-[70vh] text-center"
                    >
                        <div className="relative mb-8">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-800 flex items-center justify-center border border-white/5">
                                <ShoppingBasket size={64} className="text-zinc-600" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Sparkles size={20} className="text-blue-400" />
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Your Collection Awaits
                        </h2>
                        <p className="text-zinc-400 max-w-md mb-8 text-lg leading-relaxed">
                            Start curating your personal gallery with exclusive masterpieces from renowned artists worldwide.
                        </p>

                        <Link
                            href="/customer/products"
                            className="group px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            Explore Gallery
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
