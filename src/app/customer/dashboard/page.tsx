'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Award, Clock, Sparkles, LayoutGrid } from 'lucide-react';
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
            <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-24 pb-20">

                {/* USP Feature Highlight: View In Your Room (TOP USP) */}
                <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-zinc-900/60 backdrop-blur-xl group shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
                    <div className="absolute top-0 right-0 w-[600px] h-full bg-blue-600/20 blur-[150px] -mr-40 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/15 blur-[120px] -ml-20 -mb-20 pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row items-center gap-16 p-8 md:p-16 lg:p-20">
                        {/* Realistic AR Mockup */}
                        <div className="w-full lg:w-1/2 relative aspect-square rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl bg-zinc-950">
                            <img
                                src="/ar-preview-hero.png"
                                alt="AR Art Preview"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Scanning Animation Overlays */}
                            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent top-0 animate-scan pointer-events-none shadow-[0_0_20px_blue] z-20" />
                            <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay z-10" />

                            {/* Live Badge */}
                            <div className="absolute top-8 left-8 px-5 py-2.5 bg-black/70 backdrop-blur-xl rounded-full border border-blue-500/30 flex items-center gap-3 shadow-lg z-30">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Live AI Vision 3.0</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="w-full lg:w-1/2 space-y-10">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-black tracking-[0.2em] uppercase mb-6">
                                    <Sparkles size={14} /> The Masterpiece Experience
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.1] mb-6">
                                    Curate Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 italic">
                                        Private View
                                    </span>
                                </h1>

                                <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">
                                    Our proprietary AI-driven <span className="text-white font-medium italic underline decoration-blue-500 decoration-2 underline-offset-4">Virtual Mockup</span> allows you to visualize any masterpiece in your own living space with photorealistic precision.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4">
                                {[
                                    { icon: <TrendingUp size={18} />, title: "Precision Scale", text: "Mathematically accurate" },
                                    { icon: <Star size={18} />, title: "Dynamic Logic", text: "Real lighting response" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-3 group/item">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 transition-colors group-hover/item:border-blue-500/50">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">{item.title}</div>
                                            <div className="text-zinc-500 text-sm">{item.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Link href="/customer/products" className="relative group/btn overflow-hidden px-10 py-5 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)]">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center justify-center gap-3">
                                        Experience AR <ArrowRight size={22} className="group-hover/btn:translate-x-2 transition-transform" />
                                    </span>
                                </Link>
                                <button className="px-10 py-5 rounded-2xl border border-white/10 text-zinc-400 font-bold hover:bg-white/5 hover:text-white transition-all">
                                    Learn Technology
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <style jsx>{`
                    @keyframes scan {
                        0% { top: 0%; opacity: 0; }
                        50% { opacity: 1; }
                        100% { top: 100%; opacity: 0; }
                    }
                    .animate-scan {
                        animation: scan 4s linear infinite;
                    }
                `}</style>

                {/* Main Hero Bento */}
                <section>
                    <BentoHero />
                </section>

                {/* Shop by Category */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400">
                                <LayoutGrid size={20} />
                            </div>
                            <h2 className="text-2xl font-heading font-bold">Curated Collections</h2>
                        </div>
                        <Link href="/customer/products" className="text-sm font-bold text-zinc-500 hover:text-white transition-colors">
                            View All Categories
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {curatedCollections.map((cat, idx) => (
                            <Link href={`/customer/categories/${encodeURIComponent(cat.name)}`} key={cat.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative h-64 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0 bg-zinc-800">
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-8">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-white mb-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                                    {cat.count} Masterpieces
                                                </div>
                                                <h3 className="text-3xl font-heading font-bold text-white group-hover:text-blue-400 transition-colors">
                                                    {cat.name}
                                                </h3>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowRight size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
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
