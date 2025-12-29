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
    CreditCard,
    ShieldCheck,
    ShoppingBasket,
    ChevronLeft
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
    }, []);

    const loadCart = () => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        // Group items by ID and sum quantities if needed, 
        // but our current logic adds individual entries. 
        // Let's consolidate for better UI.
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
        // If cart becomes empty, trigger update to clear badge
        if (updated.length === 0) {
            window.dispatchEvent(new Event('cartUpdated'));
        }
    };

    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);
    // Flat shipping logic from original code, adjusted for display
    const shipping = cartItems.length > 0 ? 0 : 0; // Displayed as Free in original design, enforcing 0 here for consistency
    const total = subtotal + shipping;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                {cartItems.length > 0 ? (
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Cart Items Section */}
                        <div className="flex-1">
                            <div className="mb-8">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-4"
                                >
                                    <Link href="/customer/products" className="inline-flex items-center text-zinc-400 hover:text-white transition-colors group">
                                        <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                        Back to Gallery
                                    </Link>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-3xl md:text-4xl font-heading font-bold"
                                >
                                    Shopping Cart
                                </motion.h1>
                                <p className="text-zinc-500 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
                            </div>

                            <div className="space-y-4">
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className="group bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex gap-4 md:gap-6 items-center hover:bg-zinc-900/50 hover:border-white/10 transition-all"
                                        >
                                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{item.category}</span>
                                                        <Link href={`/customer/products/${item.id}`}>
                                                            <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors truncate">{item.name}</h3>
                                                        </Link>
                                                    </div>
                                                    <span className="text-lg font-bold text-white whitespace-nowrap hidden sm:block">
                                                        {formatPrice(item.discount_price || item.price)}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                                    <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1 border border-white/5">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-4">
                                                        <span className="text-lg font-bold text-white sm:hidden">
                                                            {formatPrice(item.discount_price || item.price)}
                                                        </span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-zinc-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-400/10"
                                                            title="Remove item"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Summary Section */}
                        <motion.aside
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:w-96 shrink-0"
                        >
                            <div className="sticky top-28 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                                <h2 className="text-xl font-heading font-semibold text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                        <span>Shipping</span>
                                        <span className="text-emerald-400 font-medium">Free</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 my-6" />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-medium text-white">Total</span>
                                    <span className="text-2xl font-bold text-white font-heading">{formatPrice(subtotal)}</span>
                                </div>

                                <button className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 group">
                                    Checkout Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                    <ShieldCheck size={14} />
                                    <span>Secure SSL Encrypted Checkout</span>
                                </div>
                            </div>
                        </motion.aside>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 min-h-[60vh] text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
                            <ShoppingBasket size={48} className="text-zinc-600" />
                        </div>
                        <h2 className="text-3xl font-heading font-bold text-white mb-4">Your collection is empty</h2>
                        <p className="text-zinc-400 max-w-md mb-8 text-lg">
                            The gallery is awaiting your curation. Explore our exclusive masterpieces to find your next investment.
                        </p>
                        <Link
                            href="/customer/products"
                            className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Explore Gallery
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
