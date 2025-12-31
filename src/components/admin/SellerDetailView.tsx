'use client';

import React, { useEffect, useState } from 'react';
import {
    ArrowLeft, Mail, Phone, Calendar, ExternalLink,
    User, Trash2, Eye, ShieldCheck, ShieldAlert,
    Package, Palette, ArrowRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Seller {
    id: string;
    full_name: string;
    email?: string;
    mobile?: string;
    bio?: string;
    portfolio_url?: string;
    avatar_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    images: string[];
    status: string;
    created_at: string;
}

interface SellerDetailViewProps {
    sellerId: string;
    onBack: () => void;
}

export default function SellerDetailView({ sellerId, onBack }: SellerDetailViewProps) {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (sellerId) {
            fetchSellerData();
        }
    }, [sellerId]);

    const fetchSellerData = async () => {
        setLoading(true);
        try {
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('*')
                .eq('id', sellerId)
                .single();

            if (sellerError) throw sellerError;
            setSeller(sellerData);

            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', sellerId)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;
            setProducts(productsData || []);

        } catch (error: any) {
            console.error('Error fetching seller data:', error);
            alert('Failed to load artist profile');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('sellers')
                .update({ status: 'approved' })
                .eq('id', sellerId);
            if (error) throw error;
            fetchSellerData();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this artist application?')) return;
        setActionLoading(true);
        try {
            const { error } = await supabase
                .from('sellers')
                .update({ status: 'rejected' })
                .eq('id', sellerId);
            if (error) throw error;
            fetchSellerData();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleApproveProduct = async (productId: string) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'approved' })
                .eq('id', productId);
            if (error) throw error;
            setProducts(products.map(p => p.id === productId ? { ...p, status: 'approved' } : p));
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== productId));
        } catch (error: any) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <ShieldAlert size={64} className="text-zinc-700" />
                <h1 className="text-2xl font-bold text-white uppercase">Artist Not Found</h1>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Return to Grid
                </button>
            </div>
        );
    }

    return (
        <div className="relative z-10">
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-16">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 text-zinc-500 hover:text-white transition-all group"
                >
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-all">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs">Return to Grid</span>
                </button>

                <div className="flex items-center gap-4">
                    {seller.status === 'pending' && (
                        <>
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="px-8 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                Approve Artist
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={actionLoading}
                                className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-400 font-black rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                            >
                                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldAlert size={16} />}
                                Reject
                            </button>
                        </>
                    )}
                    {seller.status === 'approved' && (
                        <span className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black rounded-xl text-xs uppercase tracking-widest">
                            Verified Artist
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Seller Info */}
                <div className="lg:col-span-4 space-y-8">
                    <section className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-8">
                                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-violet-600 rounded-[2.5rem] md:rounded-[3rem] blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-full h-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-2 border-white/10 bg-zinc-950 flex items-center justify-center">
                                    {seller.avatar_url ? (
                                        <img src={seller.avatar_url} alt={seller.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={64} className="text-zinc-800" />
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-4">
                                <h1 className="text-4xl font-bold text-white tracking-tight uppercase leading-none break-words">
                                    {seller.full_name}
                                </h1>
                                <p className="text-zinc-400 font-medium leading-relaxed text-sm px-4">
                                    "{seller.bio || 'This artist keeps their story shared through their masterpiece creations.'}"
                                </p>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4 group/item hover:border-blue-500/30 transition-all">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                                        <Mail size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Digital ID</p>
                                        <p className="text-white font-bold truncate text-sm">{seller.email}</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4 group/item hover:border-violet-500/30 transition-all">
                                    <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                                        <Phone size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Contact Port</p>
                                        <p className="text-white font-bold text-sm">{seller.mobile || 'Restricted'}</p>
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4 group/item hover:border-amber-500/30 transition-all">
                                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                                        <ExternalLink size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Global Link</p>
                                        {seller.portfolio_url ? (
                                            <a
                                                href={seller.portfolio_url.startsWith('http') ? seller.portfolio_url : `https://${seller.portfolio_url}`}
                                                target="_blank" rel="noopener noreferrer"
                                                className="text-amber-400 font-bold hover:text-white transition-colors text-sm flex items-center gap-2"
                                            >
                                                Visual Portfolio <ArrowRight size={14} />
                                            </a>
                                        ) : (
                                            <p className="text-zinc-600 font-bold text-sm">Unlinked</p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center gap-4 group/item">
                                    <div className="p-3 rounded-xl bg-zinc-800 text-zinc-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Genesis Date</p>
                                        <p className="text-white font-bold text-sm">
                                            {new Date(seller.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Products List */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <section className="flex-1 bg-zinc-900/30 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-12">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-bold text-white tracking-tight uppercase flex items-center gap-3">
                                    <Palette className="text-blue-500" /> Collection Grid
                                </h2>
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">{products.length} Masterpieces Uploaded</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.length > 0 ? (
                                products.map((product, idx) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-5 rounded-[2rem] bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-all group flex flex-col gap-5"
                                    >
                                        <div className="flex gap-5">
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-zinc-900">
                                                <img
                                                    src={product.images?.[0] || '/placeholder-art.jpg'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 space-y-2 py-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                        {product.category}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${product.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        product.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-blue-500/10 text-blue-400 animate-pulse'
                                                        }`}>
                                                        {product.status || 'pending'}
                                                    </span>
                                                </div>
                                                <p className="text-blue-400 font-black text-sm">₹{product.price.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-auto">
                                            {product.status !== 'approved' && (
                                                <button
                                                    onClick={() => handleApproveProduct(product.id)}
                                                    className="flex-1 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <ShieldCheck size={14} /> Authorize
                                                </button>
                                            )}
                                            <button
                                                onClick={() => window.open(`/customer/products/${product.id}`, '_blank')}
                                                className="flex-1 h-12 rounded-xl bg-white/5 text-zinc-400 font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="flex-1 h-12 rounded-xl bg-red-500/10 text-red-500 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/5 bg-zinc-950/30">
                                    <Package size={40} className="mx-auto text-zinc-800 mb-4" strokeWidth={1} />
                                    <p className="text-zinc-600 font-medium font-bold">"The artist has not initialized any data entries yet."</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
