'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, Upload, X, Loader2, Sparkles, Tag, Layers, Coins, Box, AlignLeft, Image as ImageIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
    id: string;
    name: string;
}

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        discountPrice: '',
        quantity: '0',
        description: ''
    });

    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        const { data } = await supabase.from('categories').select('id, name');
        if (data) setCategories(data);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const VALID_SIZE = 5 * 1024 * 1024;

        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (file.size > VALID_SIZE) {
                alert(`File ${file.name} is too large. Max size is 5MB.`);
                return;
            }
            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        setImages(prev => [...prev, ...validFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const imageUrls: string[] = [];

            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `product-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);
                imageUrls.push(publicUrl);
            }

            const { error } = await supabase.from('products').insert([
                {
                    name: formData.name,
                    category: formData.category,
                    price: parseFloat(formData.price),
                    discount_price: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
                    quantity: parseInt(formData.quantity),
                    description: formData.description,
                    images: imageUrls
                }
            ]);

            if (error) throw error;
            router.push('/creovo-admin-dec/vault');
        } catch (err: any) {
            alert(err.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-zinc-300 py-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Accents */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="max-w-4xl mx-auto space-y-12 relative z-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
                    >
                        <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-all">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-bold uppercase tracking-widest text-xs">Return to Grid</span>
                    </button>

                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-2">
                            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <Sparkles size={16} />
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Piece Creation</h1>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Manual Entry Protocol</p>
                    </div>
                </div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-10 font-[inherit]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* Product Name */}
                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <Tag size={12} /> Masterpiece Identity
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700 font-bold"
                                    placeholder="Enter piece name..."
                                    required
                                />
                            </div>

                            {/* Category & Stock */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <Layers size={12} /> Collection Segment
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" className="bg-zinc-900">Select Collection</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>
                                    ))}
                                    <option value="Uncategorized" className="bg-zinc-900">Legacy Category</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <Box size={12} /> Initial Inventory
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                    placeholder="00"
                                    min="0"
                                />
                            </div>

                            {/* Price & Discount */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <Coins size={12} /> Valuation (₹)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                    placeholder="0.00"
                                    step="0.01"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <Tag size={12} /> Discount Matrix (₹)
                                </label>
                                <input
                                    type="number"
                                    name="discountPrice"
                                    value={formData.discountPrice}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                    placeholder="Optional"
                                    step="0.01"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2 space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    <AlignLeft size={12} /> Masterpiece Codex
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-950/50 border border-white/5 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700 min-h-[150px] resize-none font-medium leading-relaxed"
                                    placeholder="Describe the essence of this artwork..."
                                />
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="space-y-6">
                            <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                <ImageIcon size={12} /> Visual Signature Array
                            </label>

                            <div
                                onClick={() => document.getElementById('imageInput')?.click()}
                                className="w-full h-40 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer group hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                            >
                                <input
                                    id="imageInput"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <div className="p-4 rounded-full bg-zinc-900 group-hover:bg-blue-500 group-hover:text-white text-zinc-600 transition-all">
                                    <Upload size={32} strokeWidth={1.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">Transmit Visual Data</p>
                                    <p className="text-[10px] text-zinc-700 mt-1 uppercase font-bold tracking-tighter">Support: JPEG, PNG, WEBP (MAX 5MB)</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {previews.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4"
                                    >
                                        {previews.map((src, i) => (
                                            <motion.div
                                                layout
                                                key={i}
                                                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-zinc-950"
                                            >
                                                <img src={src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Preview" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 p-2 rounded-xl bg-red-500/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} strokeWidth={3} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Actions */}
                        <div className="pt-10 flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                className="flex-1 h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 shadow-2xl shadow-blue-500/10 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                                Publish Masterpiece
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="h-16 px-10 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm"
                            >
                                Abort
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
