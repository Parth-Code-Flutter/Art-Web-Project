'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Plus,
    Eye,
    Pencil,
    Trash2,
    LogOut,
    ShoppingBag,
    Layers,
    Zap,
    Loader2,
    ArrowUpRight,
    Settings,
    TrendingUp,
    Clock,
    Search,
    ChevronDown,
    MoreHorizontal,
    Globe,
    CreditCard,
    Sparkles,
    MousePointer2,
    Activity,
    Bell,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import SellerProductModal from '@/components/seller/SellerProductModal';

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    status: 'active' | 'sold' | 'pending' | 'approved';
    views: number;
    sales: number;
    category: string;
    created_at: string;
}

export default function SellerDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'vault'>('overview');
    const [isArtModalOpen, setIsArtModalOpen] = useState(false);
    const [artToEdit, setArtToEdit] = useState<any>(null);
    const [isArtViewOnly, setIsArtViewOnly] = useState(false);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        const { data: seller } = await supabase
            .from('sellers')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!seller || seller.status !== 'approved') {
            router.push('/seller/become-artist');
            return;
        }

        setUser({ ...user, profile: seller });
        fetchSellerData(user.id);
    };

    const fetchSellerData = async (userId: string) => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', userId)
                .order('created_at', { ascending: false });

            if (data) setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => {
        const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
        const totalSales = products.reduce((acc, p) => acc + (p.sales || 0), 0);
        const revenue = products.reduce((acc, p) => acc + (p.price * (p.sales || 0)), 0);
        const active = products.filter(p => p.status === 'approved').length;
        return { totalViews, totalSales, revenue, active };
    }, [products]);

    // Custom Sparkline Data for R&D Look
    const sparklineData = [30, 45, 35, 60, 55, 75, 65, 90, 85, 95];

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Authenticating Session</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-indigo-500/30">

            {/* --- GLOBAL SIDEBAR (Linear Style) --- */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0a0a] border-r border-white-[0.03] hidden lg:flex flex-col z-50">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                            <Palette size={16} />
                        </div>
                        <span className="text-sm font-black text-white tracking-tight uppercase italic">Studio Pro</span>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-white/5 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <LayoutDashboard size={14} /> Control Center
                        </button>
                        <button
                            onClick={() => setActiveTab('vault')}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'vault' ? 'bg-white/5 text-white shadow-sm ring-1 ring-white/10' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <Layers size={14} /> Asset Vault
                            <span className="ml-auto px-1.5 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-[9px] font-black">{products.length}</span>
                        </button>
                    </nav>

                    <div className="mt-8 pt-8 border-t border-white/[0.03]">
                        <p className="px-4 text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Operations</p>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-all">
                            <TrendingUp size={14} /> Market Trends
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-all">
                            <CreditCard size={14} /> Payouts
                        </button>
                    </div>
                </div>

                <div className="mt-auto p-6 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-all">
                        <Settings size={14} /> Studio Settings
                    </button>
                    <button
                        onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500/60 hover:text-rose-400 transition-all"
                    >
                        <LogOut size={14} /> Disconnect
                    </button>
                </div>
            </aside>

            {/* --- MAIN STAGE --- */}
            <main className="lg:pl-64 min-h-screen">

                {/* Top Toolbar */}
                <header className="h-16 border-b border-white/[0.03] bg-[#080808]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-zinc-600">Studio</span>
                        <span className="text-zinc-800">/</span>
                        <span className="text-white capitalize tracking-wide">{activeTab}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/5 text-[10px] text-zinc-500">
                            <Clock size={12} />
                            <span>Last sync: Just now</span>
                        </div>
                        <div className="h-4 w-px bg-white/5 hidden md:block" />
                        <button onClick={() => setIsArtModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-[11px] font-black hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
                            <Plus size={14} /> Initialize Asset
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Performance Slate */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 p-8 rounded-3xl bg-zinc-950 border border-white/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-8">
                                            <Activity size={24} className="text-indigo-500/20" />
                                        </div>
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Portfolio Performance</p>
                                            <h2 className="text-4xl font-black text-white italic tracking-tighter mb-8">₹{(stats.revenue / 1000).toFixed(1)}k <span className="text-xs not-italic font-medium text-emerald-500 ml-2">+12.4%</span></h2>

                                            {/* Custom Sparkline View */}
                                            <div className="h-32 w-full flex items-end gap-1.5 pt-4">
                                                {sparklineData.map((val, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${val}%` }}
                                                        transition={{ duration: 1, delay: i * 0.05 }}
                                                        className="flex-1 bg-gradient-to-t from-indigo-600/10 to-indigo-500/40 rounded-t-md hover:to-indigo-400 transition-all cursor-crosshair group/bar"
                                                    >
                                                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-zinc-900 border border-white/10 px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
                                                            Day {i + 1}: {val}%
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-indigo-600 border border-indigo-500 relative flex flex-col justify-between shadow-2xl shadow-indigo-600/10 group cursor-pointer overflow-hidden">
                                        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                                        <div className="relative z-10">
                                            <h3 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none mb-2">Direct <br />Exhibition</h3>
                                            <p className="text-indigo-100 text-[11px] font-medium leading-relaxed opacity-80">Your masterpieces are currently live in the global secondary market grid.</p>
                                        </div>
                                        <div className="relative z-10 pt-10">
                                            <button className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 backdrop-blur-md hover:bg-white hover:text-indigo-600 transition-all">
                                                Go Live <ArrowUpRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Matrix Stats */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Impressions', value: stats.totalViews, icon: Eye, change: '+241' },
                                        { label: 'Acquisitions', value: stats.totalSales, icon: ShoppingBag, change: '+2' },
                                        { label: 'Active Sync', value: stats.active, icon: Zap, change: 'Stable' },
                                        { label: 'Reach Node', value: '007', icon: Globe, change: 'Global' }
                                    ].map((s, i) => (
                                        <div key={i} className="p-6 rounded-3xl bg-zinc-950 border border-white/5 flex flex-col justify-between hover:bg-zinc-900/50 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <s.icon size={14} className="text-zinc-500" />
                                                <span className="text-[9px] font-black text-indigo-500 bg-indigo-500/5 px-2 py-0.5 rounded-full">{s.change}</span>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{s.label}</p>
                                                <p className="text-xl font-bold text-white tracking-tight">{s.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Tactical Feed */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                            <Bell size={12} className="text-indigo-500" /> Recent Transmissions
                                        </h4>
                                        <div className="space-y-3">
                                            {products.slice(0, 3).map((p, i) => (
                                                <div key={i} className="group p-4 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-between hover:border-white/20 transition-all cursor-pointer">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 overflow-hidden">
                                                            <img src={p.images?.[0]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-white truncate max-w-[150px]">{p.name}</p>
                                                            <p className="text-[9px] text-zinc-600 font-medium">New impression from Tokyo, JP</p>
                                                        </div>
                                                    </div>
                                                    <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-indigo-500 transition-colors" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/5 to-transparent border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                                        <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-indigo-500 shadow-xl">
                                            <Sparkles size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white italic tracking-tighter uppercase mb-1">Curation Insights</h3>
                                            <p className="text-xs text-zinc-500 max-w-[200px] leading-relaxed">Your digital pieces are gaining 24% more traction on mobile devices.</p>
                                        </div>
                                        <button className="text-[10px] font-black text-white uppercase tracking-widest px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white hover:text-black transition-all">Optimize Metadata</button>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="vault"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-10"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Master Metadata</h2>
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none">Global inventory synchronization</p>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                            <input type="text" placeholder="Filter vault..." className="bg-zinc-950 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-800 min-w-[240px]" />
                                        </div>
                                        <button className="p-2.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white border border-white/5"><MoreHorizontal size={14} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.map((p, i) => (
                                        <motion.div
                                            key={p.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden group hover:border-white/20 transition-all"
                                        >
                                            <div className="aspect-[4/3] relative overflow-hidden bg-zinc-950">
                                                <img src={p.images?.[0]} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${p.status === 'approved' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white' : 'bg-amber-500/80 text-white'}`}>
                                                        {p.status}
                                                    </span>
                                                </div>

                                                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                    <button onClick={() => { setArtToEdit(p); setIsArtViewOnly(false); setIsArtModalOpen(true); }} className="p-2.5 rounded-lg bg-white text-black hover:bg-slate-200 shadow-xl active:scale-95"><Pencil size={14} /></button>
                                                    <button onClick={() => { if (confirm('Erase object?')) supabase.from('products').delete().eq('id', p.id).then(() => fetchSellerData(user.id)) }} className="p-2.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 shadow-xl active:scale-95"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 italic">{p.category}</p>
                                                        <h3 className="text-[13px] font-bold text-white tracking-tight truncate max-w-[160px]">{p.name}</h3>
                                                    </div>
                                                    <p className="text-sm font-black text-white italic">₹{p.price.toLocaleString()}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.03]">
                                                    <div className="flex items-center gap-2">
                                                        <Eye size={12} className="text-zinc-700" />
                                                        <span className="text-[10px] font-bold text-zinc-500">{p.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <ShoppingBag size={12} className="text-zinc-700" />
                                                        <span className="text-[10px] font-bold text-zinc-500">{p.sales || 0}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* --- MOBILE NAV (Bottom Bar) --- */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/5 rounded-2xl flex items-center justify-around px-4 z-[100] shadow-2xl">
                {['overview', 'vault'].map((id) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id as any)}
                        className={`flex flex-col items-center gap-1 transition-all ${activeTab === id ? 'text-indigo-400' : 'text-zinc-600'}`}
                    >
                        {id === 'overview' ? <LayoutDashboard size={20} /> : <Layers size={20} />}
                        <span className="text-[8px] font-black uppercase tracking-widest">{id}</span>
                    </button>
                ))}
                <button
                    onClick={() => setIsArtModalOpen(true)}
                    className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg active:scale-90"
                >
                    <Plus size={20} />
                </button>
            </div>

            <SellerProductModal
                isOpen={isArtModalOpen}
                onClose={() => setIsArtModalOpen(false)}
                onSuccess={() => user?.id && fetchSellerData(user.id)}
                productToEdit={artToEdit}
                isViewOnly={isArtViewOnly}
            />
        </div>
    );
}
