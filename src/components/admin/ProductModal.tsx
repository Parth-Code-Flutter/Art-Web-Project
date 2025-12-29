'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Trash2 } from 'lucide-react';
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

    // Load categories
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    // Load existing data if editing or viewing
    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setCategory(productToEdit.category);
            setPrice(productToEdit.price.toString());
            setDiscountPrice(productToEdit.discount_price?.toString() || '');
            setQuantity(productToEdit.quantity.toString());
            setDescription(productToEdit.description || '');
            setExistingImages(productToEdit.images || []);
            setPreviews([]); // Clear local previews
            setImages([]); // Clear local files
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

            // 1. Upload new images if any
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

            // 2. Perform Insert or Update
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
            alert(productToEdit ? 'Product updated!' : 'Product added!');
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
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div>
                                <h2 className="text-xl font-heading font-semibold text-white">
                                    {isViewOnly ? 'Product Details' : productToEdit ? 'Edit Product' : 'New Product'}
                                </h2>
                                <p className="text-sm text-zinc-400 mt-1">
                                    {isViewOnly
                                        ? 'Viewing product information.'
                                        : productToEdit
                                            ? 'Update your product details below.'
                                            : 'List a new masterpiece in your gallery.'}
                                </p>
                            </div>
                            <button
                                className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                onClick={onClose}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            <form className="space-y-6" onSubmit={handleSave}>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Product Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                        placeholder="e.g. Starry Night Recreation"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isViewOnly}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Category</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                disabled={isViewOnly}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Quantity / Stock</label>
                                        <input
                                            type="number"
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="e.g. 5"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="e.g. 5000"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            disabled={isViewOnly}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Discount Price (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                            placeholder="e.g. 4500 (Optional)"
                                            value={discountPrice}
                                            onChange={(e) => setDiscountPrice(e.target.value)}
                                            disabled={isViewOnly}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Description</label>
                                    <textarea
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px] resize-none"
                                        placeholder="Describe the artwork, medium, size, etc."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isViewOnly}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-zinc-300">Artwork Images</label>
                                    {!isViewOnly && (
                                        <div
                                            className="w-full h-32 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-zinc-900/50 transition-all group"
                                            onClick={() => document.getElementById('prodImageInput')?.click()}
                                        >
                                            <input
                                                id="prodImageInput"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                style={{ display: 'none' }}
                                            />
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Upload size={18} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <p className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                                Click to upload files (Max 5MB)
                                            </p>
                                        </div>
                                    )}

                                    {/* Image Grid */}
                                    {(existingImages.length > 0 || previews.length > 0) && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                                            {existingImages.map((url, i) => (
                                                <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                                                    <img src={url} alt="existing preview" className="w-full h-full object-cover" />
                                                    {!isViewOnly && (
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            onClick={() => removeImage(i, true)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {previews.map((url, i) => (
                                                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800 group">
                                                    <img src={url} alt="new preview" className="w-full h-full object-cover" />
                                                    {!isViewOnly && (
                                                        <button
                                                            type="button"
                                                            className="absolute top-1 right-1 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            onClick={() => removeImage(i, false)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {!isViewOnly && (
                            <div className="p-6 border-t border-white/5 bg-zinc-900/30">
                                <button
                                    onClick={handleSave}
                                    className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadowed-btn"
                                    disabled={loading || !name}
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Check size={18} />
                                            {productToEdit ? 'Update Product' : 'Add Product'}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
