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
    Loader2,
    Sparkles,
    BarChart3,
    ArrowUpRight,
    Settings,
    Bell,
    Share2,
    Check,
    Image as ImageIcon
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
        revenue: 0,
        pendingApproval: 0
    });

    // Modal States
    const [isArtModalOpen, setIsArtModalOpen] = useState(false);
    const [artToEdit, setArtToEdit] = useState<any>(null);
    const [isArtViewOnly, setIsArtViewOnly] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'masterpieces'>('overview');

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
        const { data: seller, error } = await supabase
            .from('sellers')
            .select('status, full_name, avatar_url')
            .eq('id', user.id)
            .single();

        if (error || seller?.status !== 'approved') {
            router.push('/seller/become-artist');
            return;
        }

        setUser({ ...user, profile: seller });
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
                    activePieces: data.filter(p => p.status === 'approved').length,
                    revenue: data.reduce((acc, p) => acc + (p.price * (p.sales || 0)), 0),
                    pendingApproval: data.filter(p => p.status === 'pending').length
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

    // --- Piece Actions ---
    const handleAddArt = () => {
        setArtToEdit(null);
        setIsArtViewOnly(false);
        setIsArtModalOpen(true);
    };

    const handleEditArt = (art: any) => {
        setArtToEdit(art);
        setIsArtViewOnly(false);
        setIsArtModalOpen(true);
    };

    const handleViewArt = (art: any) => {
        setArtToEdit(art);
        setIsArtViewOnly(true);
        setIsArtModalOpen(true);
    };

    const handleDeleteArt = async (id: string) => {
        if (!confirm('Are you sure you want to delete this masterpiece from your collection?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            if (user?.id) fetchSellerData(user.id);
        } catch (err: any) {
            alert(err.message || 'Error deleting artwork');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
                </div>
                <div className="relative flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-zinc-900 border border-white/5 flex items-center justify-center shadow-2xl">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] animate-pulse">Synchronizing</p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Creative Matrix</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 blur-[100px] rounded-full" />
                <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-100 pointer-events-none" />
            </div>

            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 bottom-0 w-24 lg:w-72 border-r border-white/5 bg-black/40 backdrop-blur-3xl z-[100] transition-all duration-500 group/sidebar">
                <div className="h-full flex flex-col pt-8 pb-8">
                    {/* Studio Identity */}
                    <div className="px-6 lg:px-10 mb-12">
                        <div className="flex items-center gap-4">
                            <div className="relative group/logo">
                                <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-0 group-hover/logo:opacity-40 transition duration-500" />
                                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 ring-1 ring-white/20">
                                    <Palette className="text-white" size={24} />
                                </div>
                            </div>
                            <div className="hidden lg:block">
                                <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Studio</h2>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Creator Hub</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 space-y-2">
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'masterpieces', icon: ShoppingBag, label: 'Masterpieces', count: products.length },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`w-full group flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 relative
                                    ${activeTab === item.id
                                        ? 'bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <item.icon size={22} className={activeTab === item.id ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'} />
                                <span className={`hidden lg:block font-black uppercase tracking-widest text-[11px] ${activeTab === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                    {item.label}
                                </span>
                                {item.count !== undefined && (
                                    <span className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center bg-white/5 rounded-lg text-[10px] font-bold border border-white/10">
                                        {item.count}
                                    </span>
                                )}
                                {activeTab === item.id && (
                                    <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="px-4 space-y-2 pt-8 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                            <LogOut size={22} />
                            <span className="hidden lg:block font-black uppercase tracking-widest text-[11px] opacity-70">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Core */}
            <main className="pl-24 lg:pl-72 min-h-screen relative z-10 transition-all duration-500">
                <div className="max-w-[1600px] mx-auto p-6 md:p-10 lg:p-16">
                    {/* Superior Header */}
                    <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 italic">
                                        {activeTab === 'overview' ? 'Artist Synchronized' : 'Asset Vault'}
                                    </span>
                                </div>
                                <div className="h-px w-12 bg-white/10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Studio 2.0</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                                {activeTab === 'overview' ? (
                                    <>Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-700">{user?.profile?.full_name?.split(' ')[0] || 'Creator'}</span></>
                                ) : (
                                    'Masterpieces'
                                )}
                            </h1>
                            {activeTab === 'overview' && (
                                <p className="max-w-xl text-zinc-500 font-medium text-lg border-l-2 border-white/10 pl-6 py-2 leading-relaxed">
                                    Your artistic ecosystem is fully operational. Collections are synced across the global documentation grid.
                                </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            {activeTab === 'overview' && (
                                <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020202] bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Collector" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-[#020202] bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">+12</div>
                                    </div>
                                    <div className="h-8 w-px bg-white/10" />
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">Recent Reach</p>
                                        <p className="text-xs font-bold text-white uppercase tracking-tighter italic">24h Peak Intensity</p>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleAddArt}
                                className="group relative px-10 py-5 bg-white text-black font-black rounded-[2rem] overflow-hidden transition-all hover:pr-14 active:scale-95 shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-blue-600/0 group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative flex items-center gap-3 uppercase tracking-widest text-xs italic">
                                    <Sparkles size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
                                    Initialize Creation
                                </span>
                                <Plus size={18} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                            </button>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-24"
                            >
                                {/* Intelligence Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Global Reach', value: stats.totalViews.toLocaleString(), icon: Eye, trend: '+12.5%', color: 'from-blue-600/20', iconColor: 'text-blue-400' },
                                        { label: 'Acquisitions', value: stats.totalSales.toLocaleString(), icon: TrendingUp, trend: '+4.2%', color: 'from-emerald-600/20', iconColor: 'text-emerald-400' },
                                        { label: 'Active Matrix', value: stats.activePieces.toString().padStart(2, '0'), icon: Zap, detail: `${stats.pendingApproval} Pending Review`, color: 'from-amber-600/20', iconColor: 'text-amber-400' },
                                        { label: 'Studio Worth', value: `₹${(stats.revenue / 1000).toFixed(1)}K`, icon: ShoppingBag, detail: 'Estimated Valuation', color: 'from-purple-600/20', iconColor: 'text-purple-400' },
                                    ].map((stat, i) => (
                                        <div
                                            key={i}
                                            className={`group p-10 rounded-[3rem] bg-zinc-900/20 border border-white/5 backdrop-blur-3xl relative overflow-hidden hover:bg-zinc-900/40 hover:border-white/10 transition-all duration-700 shadow-2xl shadow-black/40`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className={`w-14 h-14 rounded-3xl bg-zinc-950/50 flex items-center justify-center border border-white/5 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500 ${stat.iconColor}`}>
                                                        <stat.icon size={28} />
                                                    </div>
                                                    {stat.trend && (
                                                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                                                            <ArrowUpRight size={14} className="text-emerald-500" />
                                                            <span className="text-[10px] font-black text-emerald-500">{stat.trend}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</h3>
                                                        {stat.detail && (
                                                            <span className="text-[10px] font-medium text-zinc-600 italic whitespace-nowrap">{stat.detail}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                                    <div className="xl:col-span-2 space-y-12">
                                        {/* Performance Radar Background Display */}
                                        <div className="p-10 rounded-[4rem] bg-zinc-900/10 border border-white/5 backdrop-blur-3xl relative overflow-hidden group min-h-[400px] flex items-center">
                                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-[3s]" />
                                            <div className="relative z-10 space-y-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                                                    <Sparkles size={14} className="text-blue-500" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Global Spotlight</span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Your Collections are trending in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">7 Regions</span></h2>
                                                <p className="text-zinc-500 max-w-lg text-lg leading-relaxed">We've identified a 24% increase in visual resonance across your master catalog. Optimize your metadata tags to capture this intensity flux.</p>
                                                <button
                                                    onClick={() => alert('Metadata optimization protocols initiated. Semantic coherence increasing.')}
                                                    className="px-8 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
                                                >
                                                    Optimize Metadata
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Intelligence Feed */}
                                    <aside className="p-10 rounded-[4rem] bg-zinc-900/10 border border-white/5 backdrop-blur-2xl relative overflow-hidden group">
                                        <h3 className="text-lg font-black text-white italic uppercase tracking-widest mb-10 flex items-center gap-3">
                                            <BarChart3 size={20} className="text-blue-500" /> Insight Feed
                                        </h3>
                                        <div className="space-y-8">
                                            {products.length > 0 ? (
                                                products.slice(0, 4).map((art, i) => (
                                                    <div key={i} className="flex gap-4 relative group/event hover:translate-x-2 transition-transform duration-300">
                                                        <div className={`w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 ring-1 ring-white/10 shrink-0 ${i % 2 === 0 ? 'text-indigo-400' : 'text-amber-400'}`}>
                                                            {i % 2 === 0 ? <Zap size={18} /> : <Eye size={18} />}
                                                        </div>
                                                        <div className="flex-1 border-b border-white/5 pb-6">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <p className="text-xs font-black text-white italic tracking-tight">{i % 2 === 0 ? 'Resonance Spike' : 'New Impression'}</p>
                                                                <span className="text-[9px] font-bold text-zinc-600 uppercase">Recent</span>
                                                            </div>
                                                            <p className="text-[10px] font-medium text-zinc-500 italic truncate max-w-[150px]">{art.name} is gaining traction</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-[10px] font-black text-zinc-600 uppercase italic">Awaiting Signal...</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => alert('Signal Center connection established. All systems nominal.')}
                                            className="w-full mt-12 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            Access Signal Center <ArrowUpRight size={14} />
                                        </button>
                                    </aside>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="masterpieces"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{products.length} OBJECTS IN SECURE VAULT</p>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {products.length === 0 ? (
                                            <div className="col-span-full p-32 text-center rounded-[3rem] bg-zinc-900/10 border-2 border-dashed border-white/5">
                                                <ImageIcon size={48} className="text-zinc-800 mx-auto mb-6" />
                                                <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest italic mb-2">Vault Uninitialized</h3>
                                                <p className="text-xs text-zinc-700 font-medium italic mb-8">No visual assets have been injected into this studio sector.</p>
                                                <button onClick={handleAddArt} className="px-8 py-4 bg-blue-500/10 text-blue-400 border border-blue-600/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all">Initialize Injection</button>
                                            </div>
                                        ) : (
                                            products.map((art, i) => (
                                                <motion.div
                                                    key={art.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="group flex flex-col bg-zinc-950/40 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500 shadow-2xl"
                                                >
                                                    <div className="aspect-[4/5] relative overflow-hidden">
                                                        <img src={art.images?.[0] || '/placeholder-art.jpg'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                            <button onClick={() => handleViewArt(art)} className="p-3 rounded-xl bg-black/80 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-black transition-all"><Eye size={18} /></button>
                                                            <button onClick={() => handleEditArt(art)} className="p-3 rounded-xl bg-black/80 text-white backdrop-blur-md border border-white/10 hover:bg-blue-500 hover:text-white transition-all"><Pencil size={18} /></button>
                                                            <button onClick={() => handleDeleteArt(art.id)} className="p-3 rounded-xl bg-black/80 text-white backdrop-blur-md border border-white/10 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                                                        </div>
                                                        <div className="absolute bottom-4 left-4">
                                                            <div className={`px-3 py-1.5 rounded-xl backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest shadow-2xl
                                                                ${art.status === 'approved' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'}
                                                            `}>
                                                                {art.status || 'pending'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-8 space-y-4 flex-1 flex flex-col">
                                                        <div>
                                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic mb-1">{art.category}</p>
                                                            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-blue-400 transition-colors truncate">{art.name}</h3>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5 mt-auto">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Valuation</p>
                                                                <p className="text-lg font-black text-white italic">₹{art.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Impressions</p>
                                                                <p className="text-lg font-black text-white italic">{art.views || 0}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Artwork Management Modal */}
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
