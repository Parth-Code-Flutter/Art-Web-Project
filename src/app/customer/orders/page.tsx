'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag,
    Calendar,
    CheckCircle2,
    ArrowUpRight,
    MessageCircle,
    Copy,
    Check,
    Loader2,
    Search,
    ChevronRight,
    Clock,
    Truck,
    Receipt,
    X,
    MapPin,
    Phone,
    User,
    ArrowLeft,
    ExternalLink,
    Package
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface OrderItem {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
    image_url: string;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: 'pending_payment' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    full_name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    zip_code: string;
    order_items: OrderItem[];
}

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyId = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending_payment':
                return { label: 'Awaiting Payment', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock };
            case 'confirmed':
                return { label: 'Confirmed', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2 };
            case 'shipped':
                return { label: 'In Transit', color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', icon: Truck };
            case 'delivered':
                return { label: 'Delivered', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 };
            case 'cancelled':
                return { label: 'Cancelled', color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', icon: Receipt };
            default:
                return { label: status, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: Package };
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Accessing Orders</span>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 transition-colors duration-300">
            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl lg:text-5xl font-hero font-black tracking-tight">Orders</h1>
                        <p className="text-sm text-secondary">View and manage your recent acquisitions.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-32">
                {/* Compact Order List */}
                <div className="bg-background dark:bg-[#080808] border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl transition-colors">
                    <div className="overflow-x-auto text-foreground">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-white/[0.03] bg-zinc-50 dark:bg-white/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-caption font-black text-secondary uppercase tracking-widest">Order ID</th>
                                    <th className="px-8 py-5 text-[10px] font-caption font-black text-secondary uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-caption font-black text-secondary uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-caption font-black text-secondary uppercase tracking-widest text-right">Total</th>
                                    <th className="px-8 py-5 text-[10px] font-caption font-black text-secondary uppercase tracking-widest text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.02]">
                                {orders.map((order) => {
                                    const status = getStatusInfo(order.status);
                                    const StatusIcon = status.icon;
                                    return (
                                        <motion.tr
                                            key={order.id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="group hover:bg-zinc-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono font-bold tracking-wider">{order.id.slice(0, 8)}</span>
                                                    <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => copyId(order.id, e)}>
                                                        {copiedId === order.id ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="text-secondary" />}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-caption font-bold text-secondary capitalize whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`px-3 py-1 rounded-full border text-[10px] font-caption font-bold uppercase tracking-widest inline-flex items-center gap-1.5 ${status.bg} ${status.color} ${status.border}`}>
                                                    <StatusIcon size={10} />
                                                    {status.label}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-price font-black italic">₹{order.total_amount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-white/[0.03] border border-zinc-300 dark:border-white/5 group-hover:bg-primary group-hover:text-background transition-all flex items-center justify-center mx-auto shadow-xl">
                                                    <ChevronRight size={14} />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {orders.length === 0 && (
                            <div className="py-20 text-center">
                                <ShoppingBag className="mx-auto text-secondary mb-4 opacity-50" size={40} />
                                <p className="text-secondary text-sm font-medium uppercase tracking-widest">No orders found</p>
                                <Link href="/customer/products" className="text-primary text-xs font-black underline mt-4 block uppercase tracking-widest">Start Shopping</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* HIGH-FIDELITY ORDER DETAIL OVERLAY */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-2xl h-full bg-background dark:bg-[#050505] border-l border-zinc-200 dark:border-white/5 shadow-2xl flex flex-col transition-colors duration-300"
                        >
                            {/* Detail Header */}
                            <div className="p-8 border-b border-zinc-200 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                                    >
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <h2 className="text-xl font-section-title font-bold tracking-tight">Order Details</h2>
                                        <p className="text-[10px] font-caption font-black text-secondary uppercase tracking-[0.2em] mt-0.5">#{selectedOrder.id.slice(0, 16)}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${getStatusInfo(selectedOrder.status).bg} ${getStatusInfo(selectedOrder.status).color} ${getStatusInfo(selectedOrder.status).border}`}>
                                    {getStatusInfo(selectedOrder.status).label}
                                </div>
                            </div>

                            {/* Detail Content (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-hide">
                                {/* Status Alert */}
                                {selectedOrder.status === 'pending_payment' && (
                                    <div className="p-6 rounded-3xl bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/10 flex gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Verification Pending</p>
                                            <p className="text-[11px] text-secondary mt-1 leading-relaxed">Our curation team needs to verify payment to finalize this acquisition. Please initiate the sync below.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Delivery Core */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <h3 className="text-[10px] font-caption font-black text-secondary uppercase tracking-[0.2em]">Logistics Intelligence</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-3xl p-6 shadow-xl transition-colors">
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <User size={16} className="text-secondary" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-secondary/60 uppercase tracking-widest">Recipient</p>
                                                    <p className="text-xs font-bold mt-1 truncate">{selectedOrder.full_name}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <Phone size={16} className="text-secondary" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-secondary/60 uppercase tracking-widest">Contact</p>
                                                    <p className="text-xs font-bold mt-1">{selectedOrder.mobile}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <MapPin size={16} className="text-secondary" />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-black text-secondary/60 uppercase tracking-widest">Destination</p>
                                                    <p className="text-xs font-bold mt-1 leading-relaxed">
                                                        {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.zip_code}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Asset Registry */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Asset Inventory</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {selectedOrder.order_items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-5 p-4 bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors">
                                                <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden shrink-0 border border-zinc-200 dark:border-white/5">
                                                    <img src={item.image_url} className="w-full h-full object-cover grayscale opacity-50 dark:opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-product-title font-bold truncate">{item.product_name}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-zinc-200 dark:bg-white/5 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                                                        <span className="text-sm font-black italic text-accent">₹{item.price.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Final Valuations */}
                                <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 space-y-4 shadow-2xl transition-colors">
                                    <div className="flex justify-between items-center text-[10px] font-black text-secondary uppercase tracking-[0.3em]">
                                        <span>Inventory Value</span>
                                        <span>₹{selectedOrder.total_amount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                                        <span>Shipping Protocol</span>
                                        <span>Secured / Free</span>
                                    </div>
                                    <div className="pt-4 border-t border-zinc-200 dark:border-white/5 flex justify-between items-end">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Total Acquisition</p>
                                        <p className="text-3xl font-black italic tracking-tighter">₹{selectedOrder.total_amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Detail Footer Actions */}
                            <div className="p-8 border-t border-zinc-200 dark:border-white/5 flex flex-col gap-4 bg-background dark:bg-[#050505] transition-colors">
                                {selectedOrder.status === 'pending_payment' && (
                                    <Link
                                        href={`https://wa.me/919999999999?text=Hello! I want to confirm payment for Order ID: ${selectedOrder.id}`}
                                        target="_blank"
                                        className="w-full h-16 bg-primary text-background font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-95"
                                    >
                                        <MessageCircle size={18} /> Initiate WhatsApp Sync
                                    </Link>
                                )}
                                <div className="flex gap-4">
                                    <button className="flex-1 h-14 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all">
                                        <Receipt size={14} /> Download Invoice
                                    </button>
                                    <button className="flex-1 h-14 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center justify-center gap-2 transition-all">
                                        <ExternalLink size={14} /> Track Logistics
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
