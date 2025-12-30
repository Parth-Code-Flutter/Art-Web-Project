'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChevronLeft,
    Upload,
    Zap,
    Loader2,
    Tag,
    IndianRupee,
    Folder,
    FileText,
    Image as ImageIcon,
    ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function AddPiecePage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Digital Art',
        quantity: '1',
        imageUrl: ''
    });

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
        <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mt-64 pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-12">
                <button
                    onClick={() => router.push('/seller/dashboard')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Back to Dashboard
                </button>

                <header>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        <Zap size={12} /> New Listing
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">
                        Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">New Artwork</span>
                    </h1>
                </header>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side: Upload & Preview */}
                    <div className="space-y-8">
                        <div className="aspect-square rounded-[3rem] bg-zinc-900/40 border border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
                            {formData.imageUrl ? (
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <>
                                    <div className="w-20 h-20 rounded-3xl bg-zinc-800 flex items-center justify-center text-zinc-600 mb-4">
                                        <Upload size={32} />
                                    </div>
                                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest text-center px-8">
                                        Image Preview will appear here
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <ImageIcon size={12} /> Image URL
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://image-link.com/photo.jpg"
                                className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* Right Side: Metadata */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <Tag size={12} /> Artwork Title
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Echoes of the Void"
                                className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <IndianRupee size={12} /> Price (INR)
                                </label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="25000"
                                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                    <Folder size={12} /> Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-bold appearance-none bg-zinc-900"
                                >
                                    <option value="Digital Art">Digital Art</option>
                                    <option value="Oil Painting">Oil Painting</option>
                                    <option value="Sculpture">Sculpture</option>
                                    <option value="Photography">Photography</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                                <FileText size={12} /> Artwork Description
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe the story and inspiration behind this piece..."
                                className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium h-32 resize-none"
                            />
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <>Publish Artwork <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
