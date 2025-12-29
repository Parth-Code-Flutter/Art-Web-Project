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
import styles from './cart.module.css';

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
    };

    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        localStorage.setItem('cart', JSON.stringify(items));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);
    const shipping = cartItems.length > 0 ? 500 : 0; // Flat shipping for art
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
        <main className={styles.container}>
            <div className={styles.wrapper}>
                {cartItems.length > 0 ? (
                    <>
                        <div className={styles.cartSection}>
                            <div className={styles.titleSection}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={styles.backLink}
                                >
                                    <Link href="/customer/products" className={styles.continueShopping}>
                                        <ChevronLeft size={18} /> Back to Gallery
                                    </Link>
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.title}
                                >
                                    Shopping Cart
                                </motion.h1>
                                <span className={styles.itemCountLabel}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</span>
                            </div>

                            <div className={styles.itemsList}>
                                <AnimatePresence mode="popLayout">
                                    {cartItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, x: -50 }}
                                            transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                            className={styles.cartItem}
                                        >
                                            <div className={styles.itemImage}>
                                                <img src={item.images[0]} alt={item.name} />
                                            </div>

                                            <div className={styles.itemInfo}>
                                                <div className={styles.itemHeader}>
                                                    <span className={styles.itemCategory}>{item.category}</span>
                                                    <Link href={`/customer/products/${item.id}`} className={styles.itemName}>
                                                        {item.name}
                                                    </Link>
                                                </div>
                                                <span className={styles.itemPrice}>{formatPrice(item.discount_price || item.price)}</span>
                                            </div>

                                            <div className={styles.itemActions}>
                                                <div className={styles.quantityControl}>
                                                    <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}>
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className={styles.qtyValue}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className={styles.removeBtn} title="Remove item">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.aside
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={styles.summaryCard}
                        >
                            <h2 className={styles.summaryTitle}>Summary</h2>

                            <div className={styles.summaryDetail}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                                </div>
                            </div>

                            <div className={styles.summaryDivider} />

                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>

                            <button className={styles.checkoutBtn}>
                                Checkout <ArrowRight size={20} />
                            </button>

                            <div className={styles.secureBadge}>
                                <ShieldCheck size={14} /> Secure SSL Checkout
                            </div>
                        </motion.aside>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={styles.emptyCart}
                    >
                        <div className={styles.emptyIcon}>
                            <ShoppingBasket size={80} strokeWidth={1} />
                        </div>
                        <h2 className={styles.emptyTitle}>The Gallery is Awaiting</h2>
                        <p className={styles.emptySubtitle}>
                            Your collection is currently empty. Explore our curated selection of masterpieces to find your next great aesthetic investment.
                        </p>
                        <Link href="/customer/products" className={styles.browseBtn}>
                            Explore Gallery
                        </Link>
                    </motion.div>
                )}
            </div>
        </main>
    );
}
