'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Package, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Category {
    id: string;
    name: string;
    description?: string;
    image?: string;
    product_count?: number;
    sample_images?: string[];
}

export default function CustomerCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            // Fetch all categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (categoriesError) throw categoriesError;

            // Fetch product counts and sample images for each category
            const categoriesWithCounts = await Promise.all(
                (categoriesData || []).map(async (category) => {
                    // Get count
                    const { count } = await supabase
                        .from('products')
                        .select('*', { count: 'exact', head: true })
                        .eq('category', category.name);

                    // Get up to 4 sample product images
                    const { data: products } = await supabase
                        .from('products')
                        .select('images')
                        .eq('category', category.name)
                        .limit(4);

                    // Extract first image from each product
                    const sampleImages = products
                        ?.map(p => p.images?.[0])
                        .filter(Boolean)
                        .slice(0, 4) || [];

                    return {
                        ...category,
                        product_count: count || 0,
                        sample_images: sampleImages
                    };
                })
            );

            setCategories(categoriesWithCounts);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white pt-20 pb-20 px-6 md:px-12">

            {loading ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                    <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
                    <p className="font-medium tracking-wide">Curating collections...</p>
                </div>
            ) : categories.length > 0 ? (
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <Sparkles size={14} />
                            <span>Discover by Genre</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">
                            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Collections</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Explore the finest works across every medium and style, hand-picked for the modern collector.
                        </p>
                    </motion.div>

                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                        <AnimatePresence>
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="break-inside-avoid"
                                >
                                    <Link
                                        href={`/customer/categories/${encodeURIComponent(category.name)}`}
                                        className="group block relative bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-zinc-900/60 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 shadow-2xl"
                                    >
                                        {/* Category Image/Icon */}
                                        <div className="relative aspect-[4/3] w-full bg-zinc-800/50 overflow-hidden">
                                            {category.sample_images && category.sample_images.length > 0 ? (
                                                <div className={`grid h-full w-full ${category.sample_images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-0.5 bg-black`}>
                                                    {category.sample_images.map((img, idx) => (
                                                        <div key={idx} className="relative overflow-hidden w-full h-full">
                                                            <img
                                                                src={img}
                                                                alt={`${category.name} ${idx + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-zinc-700">
                                                    <Package size={64} strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                <div className="transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-white text-3xl font-heading font-bold">{category.name}</span>
                                                        <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                                                            {category.product_count} works
                                                        </span>
                                                    </div>
                                                    {category.description && (
                                                        <p className="text-zinc-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="absolute bottom-8 right-8 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                                    <div className="p-3 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg">
                                                        <ArrowRight size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-600">
                    <Layers size={64} strokeWidth={1} className="mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Categories Found</h3>
                    <p>Categories will appear here once they are created.</p>
                </div>
            )}
        </main>
    );
}
