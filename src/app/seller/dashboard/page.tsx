'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Palette,
    TrendingUp,
    Plus,
    Eye,
    Pencil,
    Trash2,
    LogOut,
    ShoppingBag,
    Users,
    ChevronRight,
    Zap,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    status: 'active' | 'sold';
    views: number;
    sales: number;
}

export default function SellerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalSales: 0,
        activePieces: 0,
        revenue: 0
    });

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // Verify seller status
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role, status')
            .eq('id', user.id)
            .single();

        if (error || profile?.role !== 'seller' || profile?.status !== 'approved') {
            router.push('/customer/become-artist');
            return;
        }

        setUser(user);
        fetchSellerData(user.id);
    };

    const fetchSellerData = async (userId: string) => {
        setLoading(true);
        try {
            // In a real app, we'd fetch actual products associated with this seller
            // For now, we'll simulate some data or fetch if the column exists
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', userId);

            if (!error && data) {
                setProducts(data);
                // Calculate some stats
                setStats({
                    totalViews: data.reduce((acc, p) => acc + (p.views || 0), 0),
                    totalSales: data.reduce((acc, p) => acc + (p.sales || 0), 0),
                    activePieces: data.length,
                    revenue: data.reduce((acc, p) => acc + (p.price * (p.sales || 0)), 0)
                });
            }
        } catch (err) {
            console.error('Error fetching seller data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col fixed inset-y-0 z-50 transition-all duration-300">
                <div className="p-6 lg:p-8 flex items-center justify-center lg:justify-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Palette className="text-white" size={20} />
                    </div>
                    <span className="hidden lg:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight">
                        Studio
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-8">
                    <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl bg-white/10 text-white shadow-xl">
                        <LayoutDashboard size={20} className="text-blue-400" />
                        <span className="hidden lg:block font-bold">Overview</span>
                    </button>
                    <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                        <ShoppingBag size={20} />
                        <span className="hidden lg:block font-medium">My Artwork</span>
                    </button>
                    <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                        <Users size={20} />
                        <span className="hidden lg:block font-medium">Collectors</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                    >
                        <LogOut size={20} />
                        <span className="hidden lg:block font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-20 lg:ml-64 p-6 lg:p-12">
                {/* Header */}
                <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] mb-3">
                            <span>Artist Panel</span>
                            <ChevronRight size={12} />
                            <span className="text-blue-500">Dashboard</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                            WELCOME, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600 uppercase">{user?.user_metadata?.full_name || 'Creator'}</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => router.push('/seller/add-piece')}
                        className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3 uppercase tracking-widest text-xs active:scale-95"
                    >
                        <Plus size={20} /> Add New Artwork
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Total Impressions', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-400' },
                        { label: 'Total Sales', value: stats.totalSales.toLocaleString(), icon: TrendingUp, color: 'text-emerald-400' },
                        { label: 'Active Artwork', value: stats.activePieces.toString().padStart(2, '0'), icon: Zap, color: 'text-amber-400' },
                        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: ShoppingBag, color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-white/10 transition-all shadow-2xl"
                        >
                            <div className={`w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className="text-3xl font-black text-white">{stat.value}</div>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <stat.icon size={80} strokeWidth={1} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Art List */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3">
                            <Palette size={24} className="text-blue-500" /> My Artwork
                        </h2>
                        <button className="text-blue-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors">View Public Shop</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {products.length === 0 ? (
                            <div className="p-16 text-center rounded-[3rem] bg-zinc-900/20 border border-dashed border-white/10">
                                <p className="text-zinc-500 font-medium italic mb-6">"You haven't listed any artwork yet. Start sharing your creations with the world."</p>
                                <button className="px-6 py-3 rounded-xl bg-white/5 text-white/50 border border-white/5 font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Add Your First Artwork</button>
                            </div>
                        ) : (
                            products.map((art, i) => (
                                <motion.div
                                    key={art.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-5 rounded-[2rem] bg-zinc-900/30 border border-white/5 flex items-center gap-6 hover:bg-zinc-900/50 hover:border-white/10 transition-all group shadow-lg"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl">
                                        <img src={art.images?.[0] || '/placeholder-art.jpg'} alt={art.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-bold text-white uppercase tracking-tight text-lg">{art.name}</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Price</span>
                                                <span className="text-blue-400 font-black">₹{art.price.toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Status</span>
                                                <span className="text-emerald-400 font-black uppercase text-xs tracking-widest">Active</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Views</span>
                                                <span className="text-zinc-400 font-black">{art.views || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"><Pencil size={20} /></button>
                                        <button className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"><Eye size={20} /></button>
                                        <button className="p-4 rounded-2xl bg-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"><Trash2 size={20} /></button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Ambient Background Glows */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -ml-96 -mb-96 pointer-events-none" />
        </div>
    );
}
