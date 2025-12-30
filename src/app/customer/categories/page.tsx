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
                        .eq('category', category.name)
                        .eq('status', 'approved');

                    // Get up to 4 sample product images
                    const { data: products } = await supabase
                        .from('products')
                        .select('images')
                        .eq('category', category.name)
                        .eq('status', 'approved')
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
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        <AnimatePresence>
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={`/customer/categories/${encodeURIComponent(category.name)}`}
                                        className="group block relative bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:bg-zinc-900/60 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 shadow-xl"
                                    >
                                        {/* Category Image */}
                                        <div className="relative aspect-square w-full bg-zinc-800/50 overflow-hidden">
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : category.sample_images && category.sample_images.length > 0 ? (
                                                <img
                                                    src={category.sample_images[0]}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-zinc-700">
                                                    <Package size={32} strokeWidth={1.5} />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                            {/* Content Overlay */}
                                            <div className="absolute inset-0 p-4 flex flex-col justify-end">
                                                <div className="flex items-end justify-between gap-2">
                                                    <span className="text-white text-sm md:text-base font-heading font-bold leading-tight line-clamp-2">{category.name}</span>
                                                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                                                        {category.product_count}
                                                    </span>
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
