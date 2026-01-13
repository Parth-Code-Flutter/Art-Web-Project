'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    TrendingUp,
    Shield,
    Zap,
    Eye,
    ShoppingBag,
    Palette,
    Search,
    Heart,
    Star,
    Award,
    Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import WishlistButton from '@/components/customer/WishlistButton';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    discount_price?: number;
    images: string[];
    created_at: string;
}

interface Category {
    id: string;
    name: string;
    image: string;
    count: number;
}

interface Stats {
    totalProducts: number;
    totalCategories: number;
    avgDiscount: number;
}

export default function CustomerDashboard() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [topCategories, setTopCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalCategories: 0, avgDiscount: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch featured products (newest 6)
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false })
                .limit(6);

            if (products) setFeaturedProducts(products);

            // Fetch categories with product counts
            const { data: categories } = await supabase
                .from('categories')
                .select('*')
                .limit(4);

            if (categories) {
                const categoriesWithCounts = await Promise.all(
                    categories.map(async (cat) => {
                        const { count } = await supabase
                            .from('products')
                            .select('*', { count: 'exact', head: true })
                            .eq('category', cat.name)
                            .eq('status', 'approved');

                        // Get sample image
                        let image = cat.image;
                        if (!image) {
                            const { data: sampleProduct } = await supabase
                                .from('products')
                                .select('images')
                                .eq('category', cat.name)
                                .eq('status', 'approved')
                                .limit(1)
                                .single();
                            image = sampleProduct?.images?.[0] || '';
                        }

                        return {
                            id: cat.id,
                            name: cat.name,
                            image,
                            count: count || 0
                        };
                    })
                );
                setTopCategories(categoriesWithCounts);
            }

            // Calculate stats
            const { count: totalProducts } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'approved');

            const { count: totalCategories } = await supabase
                .from('categories')
                .select('*', { count: 'exact', head: true });

            // Calculate average discount
            const { data: allProducts } = await supabase
                .from('products')
                .select('price, discount_price')
                .eq('status', 'approved')
                .not('discount_price', 'is', null);

            let avgDiscount = 0;
            if (allProducts && allProducts.length > 0) {
                const totalDiscount = allProducts.reduce((sum, p) => {
                    if (p.discount_price && p.price > 0) {
                        return sum + ((p.price - p.discount_price) / p.price * 100);
                    }
                    return sum;
                }, 0);
                avgDiscount = Math.round(totalDiscount / allProducts.length);
            }

            setStats({
                totalProducts: totalProducts || 0,
                totalCategories: totalCategories || 0,
                avgDiscount
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const calculateDiscount = (price: number, discountPrice?: number) => {
        if (!discountPrice || discountPrice >= price) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300">
            <div className="pt-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16 pb-20">

                {/* Hero Section - Showcase USPs */}
                <section className="relative overflow-hidden rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-950/30 shadow-2xl dark:shadow-none">
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="relative p-8 md:p-16 lg:p-20">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left: Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                                    <Sparkles size={16} className="animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Premium Art Gallery</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-zinc-900 dark:text-white">
                                    Discover Art
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                                        That Speaks
                                    </span>
                                </h1>

                                <p className="text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                                    Curated collection of {stats.totalProducts}+ authentic artworks across {stats.totalCategories}+ categories.
                                    Experience art like never before with our innovative platform.
                                </p>

                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.totalProducts}+</div>
                                        <div className="text-sm text-zinc-500 font-medium">Artworks</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black text-zinc-900 dark:text-white">{stats.totalCategories}+</div>
                                        <div className="text-sm text-zinc-500 font-medium">Categories</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{stats.avgDiscount}%</div>
                                        <div className="text-sm text-zinc-500 font-medium">Avg Savings</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Link
                                        href="/customer/products"
                                        className="group px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-center hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
                                    >
                                        Explore Gallery
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        href="/customer/categories"
                                        className="px-8 py-4 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white rounded-2xl font-bold text-center hover:bg-zinc-200 dark:hover:bg-white/10 transition-all"
                                    >
                                        Browse Categories
                                    </Link>
                                </div>
                            </div>

                            {/* Right: USP Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    {
                                        icon: <Eye size={24} />,
                                        title: "AR Preview",
                                        desc: "Visualize in your space",
                                        color: "blue"
                                    },
                                    {
                                        icon: <Shield size={24} />,
                                        title: "Authentic",
                                        desc: "100% verified artworks",
                                        color: "green"
                                    },
                                    {
                                        icon: <Zap size={24} />,
                                        title: "Instant Search",
                                        desc: "Find art in seconds",
                                        color: "purple"
                                    },
                                    {
                                        icon: <Heart size={24} />,
                                        title: "Curated",
                                        desc: "Hand-picked collections",
                                        color: "pink"
                                    }
                                ].map((usp, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`p-6 rounded-2xl bg-white dark:bg-${usp.color}-500/5 border border-zinc-100 dark:border-${usp.color}-500/20 shadow-lg dark:shadow-none hover:shadow-xl dark:hover:bg-${usp.color}-500/10 transition-all group cursor-pointer`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-${usp.color}-50 dark:bg-${usp.color}-500/10 text-${usp.color}-500 dark:text-${usp.color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                            {usp.icon}
                                        </div>
                                        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">{usp.title}</h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{usp.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Categories */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                <Palette size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Explore by Category</h2>
                                <p className="text-sm text-zinc-500 mt-1">Discover curated collections</p>
                            </div>
                        </div>
                        <Link
                            href="/customer/categories"
                            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            View All
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topCategories.map((category, idx) => (
                            <Link href={`/customer/categories/${encodeURIComponent(category.name)}`} key={category.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative h-72 rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-white/20 transition-all shadow-md dark:shadow-none"
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-70 group-hover:opacity-100 dark:group-hover:opacity-50"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold text-white mb-3">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                            {category.count} Artworks
                                        </div>
                                        <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors mb-2">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Explore Collection</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Featured Artworks */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Star size={22} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Latest Arrivals</h2>
                                <p className="text-sm text-zinc-500 mt-1">Freshly added to our collection</p>
                            </div>
                        </div>
                        <Link
                            href="/customer/products"
                            className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-2"
                        >
                            View All
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product, idx) => (
                                <Link href={`/customer/products/${product.id}`} key={product.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group relative bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-xl dark:hover:bg-zinc-900/50 transition-all"
                                    >
                                        {/* Image */}
                                        <div className="aspect-square relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900" />
                                            )}

                                            {/* Discount Badge */}
                                            {product.discount_price && calculateDiscount(product.price, product.discount_price) > 0 && (
                                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-black">
                                                    {calculateDiscount(product.price, product.discount_price)}% OFF
                                                </div>
                                            )}

                                            {/* New Badge */}
                                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-blue-500/90 backdrop-blur-sm text-white rounded-full text-xs font-black flex items-center gap-1.5">
                                                <Sparkles size={12} />
                                                NEW
                                            </div>

                                            {/* Wishlist Button */}
                                            <div className="absolute bottom-4 left-4 z-20">
                                                <WishlistButton productId={product.id} size="md" />
                                            </div>

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 space-y-3">
                                            <div>
                                                <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-zinc-500 mt-1">{product.category}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-zinc-500 dark:text-zinc-600 font-bold uppercase tracking-wider">Price</span>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                                                            {formatPrice(product.discount_price || product.price)}
                                                        </span>
                                                        {product.discount_price && product.discount_price < product.price && (
                                                            <span className="text-sm text-zinc-400 line-through">
                                                                {formatPrice(product.price)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <ArrowRight size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Why Choose Us - Real USPs */}
                <section className="relative rounded-3xl overflow-hidden bg-zinc-900 dark:bg-gradient-to-br dark:from-zinc-900 dark:via-zinc-900 dark:to-purple-950/30 border border-zinc-800 dark:border-white/10 p-8 md:p-12">
                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
                                <Award size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Why Choose Us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">Your Premium Art Experience</h2>
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                                We've built the most advanced art discovery platform with features that matter
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Search size={28} />,
                                    title: "Smart Search",
                                    desc: "Find exactly what you're looking for with our intelligent search system",
                                    color: "blue"
                                },
                                {
                                    icon: <ShoppingBag size={28} />,
                                    title: "Seamless Cart",
                                    description: "Beautiful, responsive cart experience optimized for mobile and desktop",
                                    color: "green"
                                },
                                {
                                    icon: <TrendingUp size={28} />,
                                    title: "Best Prices",
                                    desc: `Average ${stats.avgDiscount}% savings across our collection`,
                                    color: "purple"
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                                >
                                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 text-${feature.color}-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-zinc-400">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                </section>

            </div>
        </main>
    );
}
