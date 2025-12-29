'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Award, Clock } from 'lucide-react';
import BentoHero from '@/components/customer/BentoHero';
import { supabase } from '@/lib/supabase';

interface DashboardCategory {
    id: string;
    name: string;
    image: string;
    count: number;
}

export default function CustomerDashboard() {
    const [recentProducts, setRecentProducts] = useState<any[]>([]);
    const [curatedCollections, setCuratedCollections] = useState<DashboardCategory[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await Promise.all([fetchRecentDrops(), fetchCuratedCollections()]);
    };

    const fetchRecentDrops = async () => {
        const { data } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4);

        if (data) setRecentProducts(data);
    };

    const fetchCuratedCollections = async () => {
        try {
            // Fetch top 3 categories
            const { data: categories } = await supabase
                .from('categories')
                .select('*')
                .limit(3);

            if (!categories) return;

            const collectionsWithData = await Promise.all(categories.map(async (cat) => {
                // Get product count
                const { count } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true })
                    .eq('category', cat.name);

                // Get one sample image if category image is missing or just to be safe
                let image = cat.image;
                if (!image) {
                    const { data: products } = await supabase
                        .from('products')
                        .select('images')
                        .eq('category', cat.name)
                        .limit(1)
                        .single();
                    image = products?.images?.[0] || 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop';
                }

                return {
                    id: cat.id,
                    name: cat.name,
                    image: image,
                    count: count || 0
                };
            }));

            setCuratedCollections(collectionsWithData);
        } catch (error) {
            console.error('Error fetching collections:', error);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="pt-20 lg:pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-20 pb-20">

                {/* Hero Section */}
                <section>
                    <BentoHero />
                </section>

                {/* Trending Collections */}
                <section>
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-heading font-bold mb-2">Curated Collections</h2>
                            <p className="text-zinc-400">Explore art by genre and movement.</p>
                        </div>
                        <Link href="/customer/categories" className="flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-400 transition-colors">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {curatedCollections.length > 0 ? (
                            curatedCollections.map((collection, idx) => (
                                <Link href={`/customer/products?category=${encodeURIComponent(collection.name)}`} key={collection.id} className="block w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
                                    >
                                        <img
                                            src={collection.image}
                                            alt={collection.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute bottom-6 left-6">
                                            <span className="text-xs font-medium text-blue-400 mb-1 block">{collection.count} Works</span>
                                            <h3 className="text-xl font-bold font-heading">{collection.name}</h3>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        ) : (
                            // Loading Skeletons
                            [1, 2, 3].map((i) => (
                                <div key={i} className="h-64 rounded-3xl bg-zinc-900 animate-pulse border border-zinc-800" />
                            ))
                        )}
                    </div>
                </section>

                {/* Recent Drops / New Arrivals */}
                <section>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                            <Clock size={20} />
                        </div>
                        <h2 className="text-2xl font-heading font-bold">Just Dropped</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recentProducts.map((product, idx) => (
                            <Link href={`/customer/products/${product.id}`} key={product.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:bg-zinc-900/50 hover:border-white/10 transition-all group"
                                >
                                    <div className="aspect-square relative overflow-hidden bg-zinc-800">
                                        <img
                                            src={product.images?.[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        {product.discount_price && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/10">
                                                Sale
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-white truncate mb-1">{product.name}</h4>
                                        <p className="text-sm text-zinc-500 mb-3">{product.category}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.discount_price || product.price)}
                                            </span>
                                            <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Artist Spotlight (Storytelling) */}
                <section className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1560932669-5e320f2b1d6f?q=80&w=2600&auto=format&fit=crop" // Cool studio shot
                            alt="Artist Background"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    </div>

                    <div className="relative p-8 md:p-12 lg:p-16 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold tracking-wider uppercase mb-6">
                            <Award size={14} /> Artist of the Month
                        </div>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Elena Vasquez</h2>
                        <p className="text-xl text-zinc-300 leading-relaxed mb-8">
                            "Art is not just what you see, but what you make others see." <br />
                            Discover Elena's controversial yet mesmerizing digital landscapes that are taking the art world by storm.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
                                View Collection
                            </button>
                            <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                                Read Biography
                            </button>
                        </div>
                    </div>
                </section>

                {/* Value Props */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-t border-white/5">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                            <Award size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Curated Excellence</h3>
                        <p className="text-zinc-500">Every piece is hand-picked by our expert curators to ensure maximum value.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Asset Appreciation</h3>
                        <p className="text-zinc-500">Invest in artists with proven track records and rising market demand.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                            <Star size={24} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">VIP Experience</h3>
                        <p className="text-zinc-500">Enjoy priority access to new drops and exclusive exhibitions.</p>
                    </div>
                </section>

            </div>
        </main>
    );
}
