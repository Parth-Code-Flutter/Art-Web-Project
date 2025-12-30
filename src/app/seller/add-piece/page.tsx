'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Upload,
    Zap,
    Loader2,
    Tag,
    IndianRupee,
    Layers,
    FileText,
    Image as ImageIcon,
    ArrowRight,
    Sparkles,
    Check,
    Box,
    AlignLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AddPiecePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        discountPrice: '',
        category: 'Digital Art',
        quantity: '1',
        imageUrl: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    quantity: parseInt(formData.quantity),
                    category: formData.category,
                    images: [formData.imageUrl],
                    seller_id: user.id
                });

            if (error) throw error;
            router.push('/seller/dashboard');
        } catch (err: any) {
            alert(err.message || 'Error publishing artwork');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 relative overflow-hidden flex flex-col items-center">
            {/* Ambient Background Elements */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -ml-32 -mt-32 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-32 -mb-32 pointer-events-none" />

            <div className="max-w-6xl w-full relative z-10 space-y-12">
                {/* Back Link */}
                <button
                    onClick={() => router.push('/seller/dashboard')}
                    className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Exit Workspace
                </button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={12} /> Studio Initialization
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mb-2">
                            Initialize <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-600">Masterpiece</span>
                        </h1>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest pl-1">
                            Synchronizing your vision into the global gallery grid
                        </p>
                    </div>
                    <div className="hidden lg:block w-32 h-32 bg-zinc-900/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-zinc-800">
                        <ImageIcon size={48} strokeWidth={1} />
                    </div>
                </div>

                {/* Main Creation Grid */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-zinc-900/20 border border-white/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl">

                    {/* Left: Visual Injection */}
                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                            <div className="relative aspect-square rounded-[3rem] bg-zinc-950/60 border border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-violet-500/30">
                                {formData.imageUrl ? (
                                    <img
                                        src={formData.imageUrl}
                                        alt="Masterpiece Preview"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-center p-8 space-y-6">
                                        <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 flex items-center justify-center text-zinc-600 border border-white/5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                            <Upload size={32} />
                                        </div>
                                        <div>
                                            <p className="text-white font-black uppercase text-xs tracking-[0.2em]">Awaiting Visual Payload</p>
                                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">Inject image URL below for preview</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                                <ImageIcon size={12} className="text-violet-500" /> Digital Signature (URL)
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://cdn.art/piece-01.jpg"
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-5 text-zinc-300 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Right: Metadata Matrix */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                                <Tag size={12} className="text-violet-500" /> Piece Nomenclature
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Quantum Echoes #04"
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-lg font-black italic tracking-tighter uppercase"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    <IndianRupee size={12} className="text-violet-500" /> Valuation [INR]
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="50,000"
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-black"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                                    <Layers size={12} className="text-violet-500" /> Segment
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-violet-500/50 transition-all text-sm font-black appearance-none text-white cursor-pointer"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>
                                        ))}
                                        {categories.length === 0 && <option value="Digital Art">Digital Art</option>}
                                    </select>
                                    <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 rotate-90 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 flex items-center gap-2">
                                <AlignLeft size={12} className="text-violet-500" /> Piece Codex
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the biological and digital essence of this creation..."
                                className="w-full bg-zinc-950/50 border border-white/5 rounded-[2rem] px-6 py-5 text-zinc-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-sm font-medium h-32 resize-none leading-relaxed italic"
                            />
                        </div>

                        <div className="pt-8 space-y-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-20 bg-white text-black font-black rounded-[2rem] hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.3em] text-xs disabled:opacity-50 shadow-[0_20px_60px_rgba(255,255,255,0.05)]"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>Initialize Masterpiece <Check size={20} strokeWidth={3} /></>
                                )}
                            </button>
                            <p className="text-center text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                                This action will broadcast your artwork to <span className="text-zinc-400">Quantum Collectors</span> globally
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
