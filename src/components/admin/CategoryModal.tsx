'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    image_url: string;
}

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categoryToEdit?: Category | null;
    isViewOnly?: boolean;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, categoryToEdit, isViewOnly }: CategoryModalProps) {
    const [name, setName] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoryToEdit) {
            setName(categoryToEdit.name);
            setPreview(categoryToEdit.image_url);
        } else {
            setName('');
            setImage(null);
            setPreview(null);
        }
    }, [categoryToEdit, isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isViewOnly) return;
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Image size exceeds 5MB limit.');
            return;
        }

        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isViewOnly || !name) return;

        setLoading(true);
        try {
            let imageUrl = preview || '';

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `category-images/${fileName}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                if (data) {
                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);
                    imageUrl = publicUrl;
                }
            }

            if (categoryToEdit) {
                const { error } = await supabase
                    .from('categories')
                    .update({ name, image_url: imageUrl })
                    .eq('id', categoryToEdit.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([{ name, image_url: imageUrl }]);
                if (error) throw error;
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Operation failed:', err);
            alert(err.message || 'Error saving category');
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
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-xl bg-zinc-900 border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                        <div className="p-8 md:p-12">
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-2 rounded-xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>

                            <header className="mb-10 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4">
                                    <Sparkles size={24} />
                                </div>
                                <h2 className="text-3xl font-bold text-white tracking-tight uppercase">
                                    {isViewOnly ? 'Quantum Archive' : categoryToEdit ? 'Data Reconfiguration' : 'New Collection'}
                                </h2>
                                <p className="text-zinc-500 text-sm mt-2 font-medium tracking-wide">
                                    {isViewOnly
                                        ? 'Accessing historical collection records.'
                                        : 'Synchronizing new category parameters into the grid.'}
                                </p>
                            </header>

                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Collection Identity</label>
                                    <input
                                        type="text"
                                        placeholder="Enter collection name..."
                                        className="w-full bg-zinc-950/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700 font-bold"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={isViewOnly}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Visual Signature</label>
                                    <div
                                        className={`group relative aspect-video rounded-[2rem] bg-zinc-950/50 border-2 border-dashed border-white/5 overflow-hidden flex flex-col items-center justify-center gap-4 transition-all duration-300 ${!isViewOnly ? 'hover:border-blue-500/50 cursor-pointer' : ''}`}
                                        onClick={() => !isViewOnly && document.getElementById('catImageInput')?.click()}
                                    >
                                        <input
                                            id="catImageInput"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            disabled={isViewOnly}
                                        />

                                        {preview ? (
                                            <>
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                {!isViewOnly && (
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                                                        <Upload className="text-white" size={32} />
                                                        <span className="text-white text-xs font-black uppercase tracking-widest">Update Essence</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 rounded-full bg-zinc-900 text-zinc-600 group-hover:text-blue-500 group-hover:bg-blue-500/5 transition-all">
                                                    <ImageIcon size={40} strokeWidth={1.5} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                                        {isViewOnly ? 'Empty Signature' : 'Inject Visual Data'}
                                                    </p>
                                                    {!isViewOnly && <p className="text-[10px] text-zinc-700 mt-1 uppercase font-bold tracking-tighter">Recommended: 1280x720px</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    {!isViewOnly ? (
                                        <button
                                            type="submit"
                                            disabled={loading || !name}
                                            className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 shadow-xl shadow-white/5 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-sm"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} strokeWidth={3} />}
                                            {categoryToEdit ? 'Commit Changes' : 'Initialize Collection'}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="w-full h-16 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-sm"
                                        >
                                            Exit Archive
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
