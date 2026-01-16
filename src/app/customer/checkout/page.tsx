'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ShieldCheck,
    CreditCard,
    Zap,
    ArrowRight,
    MapPin,
    Phone,
    User,
    Package,
    Loader2,
    Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface CartItem {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    images: string[];
    category: string;
    quantity: number;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Form Stats
    const [formData, setFormData] = useState({
        fullName: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load Cart
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (savedCart.length === 0) {
            router.push('/customer/cart');
            return;
        }
        setCartItems(savedCart);

        // Load User
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setUser(user);
            // Fetch from customers table now
            const { data: customerData } = await supabase.from('customers').select('*').eq('id', user.id).single();
            if (customerData) {
                setFormData(prev => ({
                    ...prev,
                    firstName: customerData.full_name?.split(' ')[0] || '',
                    lastName: customerData.full_name?.split(' ').slice(1).join(' ') || '',
                    email: customerData.email || user.email || '',
                    phone: customerData.mobile || '',
                    // Address fields might need to be added to customers table or fetched from orders
                }));
            }
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.discount_price || item.price) * item.quantity, 0);

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to finalize your reservation.');
            return;
        }
        setLoading(true);

        try {
            // 1. Prepare Order Data
            const newOrderId = crypto.randomUUID();

            const orderData = {
                id: newOrderId,
                customer_id: user.id,
                full_name: formData.fullName,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                city: formData.city,
                zip_code: formData.zipCode,
                total_amount: subtotal,
                status: 'pending_payment'
            };

            const itemsData = cartItems.map(item => ({
                order_id: newOrderId,
                product_id: item.id,
                product_name: item.name,
                price: item.discount_price || item.price,
                quantity: item.quantity,
                image_url: item.images[0]
            }));

            // 2. Transmit to Secure Server Endpoint (Bypassing RLS Recursion)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: orderData,
                    items: itemsData
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Server Protocol Failed');
            }

            // 3. Clear Cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('cartUpdated'));

            // 4. Redirect to Success Page
            router.push(`/customer/checkout/success?id=${newOrderId}`);

        } catch (error: any) {
            console.error('Order Failure:', error);
            alert(error.message || 'Transmission interrupted. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-500 dark:text-zinc-400 font-sans pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Left Side: Information Architecture */}
                <div className="lg:col-span-7 space-y-12">
                    <header className="space-y-4">
                        <Link href="/customer/cart" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <ChevronLeft size={14} /> Back to Collection
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-hero font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter leading-none">
                            Secure <br />Reservation
                        </h1>
                        <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-500 max-w-md">
                            Bypass traditional payment gateways. Secure your masterpiece directly through our exclusive curator network.
                        </p>
                    </header>

                    <form onSubmit={handleSubmitOrder} className="space-y-8">
                        {/* Identity Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 dark:bg-indigo-600/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-500 flex items-center justify-center text-[10px] font-black">01</span>
                                <h2 className="text-xs font-section-title font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">Identity Core</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-caption font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Legal Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-700 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                        <input
                                            required
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-xs font-input font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500/40 transition-all shadow-sm dark:shadow-none"
                                            placeholder="Your Response"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-caption font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Active Comms (Phone)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-700 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                        <input
                                            required
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-xs font-input font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500/40 transition-all shadow-sm dark:shadow-none"
                                            placeholder="+91..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Origin Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 dark:bg-indigo-600/10 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-500 flex items-center justify-center text-[10px] font-black">02</span>
                                <h2 className="text-xs font-section-title font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">Delivery Coordinates</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-caption font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">Logistics Address</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-4 top-5 text-zinc-400 dark:text-zinc-700 group-focus-within:text-indigo-500 transition-colors" size={14} />
                                        <textarea
                                            required
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl pl-12 pr-4 py-4 text-xs font-input font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500/40 transition-all min-h-[100px] resize-none shadow-sm dark:shadow-none"
                                            placeholder="Enter precise location..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-caption font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">City Node</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-4 text-xs font-input font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500/40 transition-all shadow-sm dark:shadow-none"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-caption font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600 ml-1">ZIP / Postal</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl px-4 py-4 text-xs font-input font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 dark:focus:border-indigo-500/40 transition-all shadow-sm dark:shadow-none"
                                            placeholder="400001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Commitment Section */}
                        <div className="pt-10 border-t border-zinc-200 dark:border-white/[0.03] space-y-6">
                            <div className="bg-indigo-50/50 border border-indigo-100 dark:bg-indigo-600/5 dark:border-indigo-500/10 p-6 rounded-2xl flex gap-4">
                                <ShieldCheck className="text-indigo-600 dark:text-indigo-500 shrink-0" size={20} />
                                <p className="text-[10px] font-medium leading-relaxed text-zinc-600 dark:text-zinc-400">
                                    By proceeding, your reservation is encrypted and sent directly to our curators. No payment is required until our team verifies the piece's availability.
                                </p>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-black font-button font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-4 shadow-xl shadow-zinc-900/10 dark:shadow-[0_20px_40px_rgba(255,255,255,0.05)] active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>Commit Reservation <ArrowRight size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side: Asset Review */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 space-y-8">
                        <section className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-xl dark:shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-section-title font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-white">Asset Review</h3>
                                <Package size={16} className="text-zinc-400 dark:text-zinc-800" />
                            </div>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-3 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 rounded-2xl">
                                        <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-900 overflow-hidden shrink-0">
                                            <img src={item.images[0]} className="w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <p className="text-[11px] font-heading font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                                            <p className="text-[9px] font-caption font-medium text-zinc-500 dark:text-zinc-600 mt-1 uppercase tracking-widest">{item.category}</p>
                                            <p className="text-xs font-price font-black text-indigo-600 dark:text-indigo-400 mt-2 italic">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-zinc-100 dark:border-white/[0.03] space-y-4">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-zinc-500 dark:text-zinc-600">Total Valuation</span>
                                    <span className="text-zinc-900 dark:text-white italic text-lg">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-zinc-400 dark:text-zinc-800">Curation Protocol</span>
                                    <span className="text-emerald-600 dark:text-emerald-500">Secured</span>
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-white/5">
                            <Lock size={14} className="text-indigo-600 dark:text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-600">Encrypted Transition Protocol</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
