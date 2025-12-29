'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Trash2, Loader2, Sparkles, Image as ImageIcon, Layers, Tag, Coins, Box, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    quantity: number;
    category: string;
    images: string[];
}

interface Category {
    id: string;
    name: string;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit?: Product | null;
    isViewOnly?: boolean;
}

export default function ProductModal({ isOpen, onClose, onSuccess, productToEdit, isViewOnly }: ProductModalProps) {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setCategory(productToEdit.category);
            setPrice(productToEdit.price.toString());
            setDiscountPrice(productToEdit.discount_price?.toString() || '');
            setQuantity(productToEdit.quantity.toString());
            setDescription(productToEdit.description || '');
            setExistingImages(productToEdit.images || []);
            setPreviews([]);
            setImages([]);
        } else {
            setName('');
            setCategory('');
            setPrice('');
            setDiscountPrice('');
            setQuantity('');
            setDescription('');
            setExistingImages([]);
            setPreviews([]);
            setImages([]);
        }
    }, [productToEdit, isOpen]);

    async function fetchCategories() {
        const { data } = await supabase.from('categories').select('id, name');
        setCategories(data || []);
    }

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewOnly) return;
        const files = Array.from(e.target.files || []);
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        files.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert(`${file.name} exceeds 5MB limit.`);
            } else {
                validFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            }
        });

        setImages(prev => [...prev, ...validFiles]);
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number, isExisting: boolean) => {
        if (isViewOnly) return;
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
            setPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly || !name || !category || !price) return;

        setLoading(true);
        try {
            let uploadedImageUrls: string[] = [...existingImages];

            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `products/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    uploadedImageUrls.push(publicUrl);
                }
            }

            const productData = {
                name,
                category,
                price: parseFloat(price),
                discount_price: discountPrice ? parseFloat(discountPrice) : null,
                quantity: parseInt(quantity) || 0,
                description,
                images: uploadedImageUrls
            };

            if (productToEdit) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productToEdit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Operation failed:', err);
            alert(err.message || 'Error saving product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 40 }}
                        className="relative w-full max-w-3xl bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between shrink-0">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                        <Sparkles size={20} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                                        {isViewOnly ? 'Entity Analysis' : productToEdit ? 'Masterpiece Revision' : 'New Creation'}
                                    </h2>
                                </div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-1">
                                    {isViewOnly ? 'Viewing secure object metadata' : 'Synchronizing visual data into the grid'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-8 scrollbar-hide">
                            <form id="productForm" onSubmit={handleSave} className="space-y-8">

                                {/* Identity Block */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                            <Tag size={12} /> Masterpiece Identity
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter piece name..."
                                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700 font-bold"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                            <Layers size={12} /> Collection Segment
                                        </label>
                                        <select
                                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold appearance-none cursor-pointer"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        >
                                            <option value="" className="bg-zinc-900">Select Collection</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Logistics Block */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                            <Coins size={12} /> Valuation (₹)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                            <Tag size={12} /> Discounted (₹)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="Optional"
                                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                            <Box size={12} /> Grid Stock
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="00"
                                            className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description Block */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        <AlignLeft size={12} /> Masterpiece Codex
                                    </label>
                                    <textarea
                                        placeholder="Describe the essence of this artwork..."
                                        className="w-full bg-zinc-950/50 border border-white/5 rounded-[2rem] px-6 py-5 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700 min-h-[120px] resize-none font-medium leading-relaxed"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isViewOnly}
                                    />
                                </div>

                                {/* Visual Data Block */}
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                        <ImageIcon size={12} /> Visual Signature Array
                                    </label>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {/* Existing & Previews */}
                                        {[...existingImages.map((u, i) => ({ url: u, id: i, existing: true })),
                                        ...previews.map((u, i) => ({ url: u, id: i, existing: false }))].map((img, idx) => (
                                            <motion.div
                                                layout
                                                key={`${img.existing ? 'e' : 'p'}-${img.id}`}
                                                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-inner"
                                            >
                                                <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                {!isViewOnly && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(img.id, img.existing)}
                                                        className="absolute top-1 right-1 p-1.5 rounded-lg bg-red-500/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        ))}

                                        {/* Upload Trigger */}
                                        {!isViewOnly && (
                                            <div
                                                onClick={() => document.getElementById('prodImageInput')?.click()}
                                                className="aspect-square rounded-2xl border-2 border-dashed border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group"
                                            >
                                                <input id="prodImageInput" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                                                <Upload className="text-zinc-700 group-hover:text-blue-500 transition-colors" size={24} strokeWidth={1.5} />
                                                <span className="text-[8px] font-black uppercase text-zinc-600 group-hover:text-blue-400 tracking-widest">Inject Data</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-8 md:p-10 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl shrink-0">
                            {!isViewOnly ? (
                                <button
                                    form="productForm"
                                    type="submit"
                                    disabled={loading || !name}
                                    className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 shadow-2xl shadow-blue-500/10 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                                    {productToEdit ? 'Commit Revision' : 'Initialize Masterpiece'}
                                </button>
                            ) : (
                                <button
                                    onClick={onClose}
                                    className="w-full h-16 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm"
                                >
                                    Exit Analysis
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
