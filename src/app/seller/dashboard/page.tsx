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
            <aside className="fixed left-0 top-0 bottom-0 w-24 lg:w-72 border-r border-white/5 bg-black/40 backdrop-blur-2xl z-[100] transition-all duration-500 group/sidebar">
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
                            { icon: LayoutDashboard, label: 'Dashboard', active: true },
                            { icon: ShoppingBag, label: 'Masterpieces', count: products.length },
                            { icon: BarChart3, label: 'Analytics' },
                            { icon: Users, label: 'Collectors' },
                            { icon: Bell, label: 'Intents' },
                        ].map((item, i) => (
                            <button
                                key={i}
                                className={`w-full group flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] transition-all duration-300 relative
                                    ${item.active
                                        ? 'bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)]'
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }
                                `}
                            >
                                <item.icon size={22} className={item.active ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'} />
                                <span className={`hidden lg:block font-black uppercase tracking-widest text-[11px] ${item.active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                                    {item.label}
                                </span>
                                {item.count !== undefined && (
                                    <span className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center bg-white/5 rounded-lg text-[10px] font-bold border border-white/10">
                                        {item.count}
                                    </span>
                                )}
                                {item.active && (
                                    <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="px-4 space-y-2 pt-8 border-t border-white/5">
                        <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                            <Settings size={22} />
                            <span className="hidden lg:block font-black uppercase tracking-widest text-[11px] opacity-70">Control Tower</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 rounded-[1.5rem] text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all"
                        >
                            <LogOut size={22} />
                            <span className="hidden lg:block font-black uppercase tracking-widest text-[11px] opacity-70">Terminate</span>
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
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 italic">Artist Synchronized</span>
                                </div>
                                <div className="h-px w-12 bg-white/10" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Studio 2.0</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">
                                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-700">{user?.profile?.full_name?.split(' ')[0] || 'Creator'}</span>
                            </h1>
                            <p className="max-w-xl text-zinc-500 font-medium text-lg border-l-2 border-white/10 pl-6 py-2 leading-relaxed">
                                Your artistic ecosystem is fully operational. Collections are synced across the global documentation grid.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6">
                            {/* Fast Actions */}
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

                    {/* Intelligence Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
                        {[
                            { label: 'Global Reach', value: stats.totalViews.toLocaleString(), icon: Eye, trend: '+12.5%', color: 'from-blue-600/20', iconColor: 'text-blue-400' },
                            { label: 'Acquisitions', value: stats.totalSales.toLocaleString(), icon: TrendingUp, trend: '+4.2%', color: 'from-emerald-600/20', iconColor: 'text-emerald-400' },
                            { label: 'Active Matrix', value: stats.activePieces.toString().padStart(2, '0'), icon: Zap, detail: `${stats.pendingApproval} Pending Review`, color: 'from-amber-600/20', iconColor: 'text-amber-400' },
                            { label: 'Studio Worth', value: `₹${(stats.revenue / 1000).toFixed(1)}K`, icon: ShoppingBag, detail: 'Estimated Valuation', color: 'from-purple-600/20', iconColor: 'text-purple-400' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
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

                                    {/* Abstract Data Visualizer */}
                                    <div className="mt-8 flex items-end gap-1 h-8 opacity-30 group-hover:opacity-60 transition-opacity">
                                        {[4, 7, 3, 9, 5, 8, 2, 6, 4].map((h, j) => (
                                            <div
                                                key={j}
                                                className={`flex-1 rounded-full bg-white/20 transition-all duration-1000 delay-${j * 100}`}
                                                style={{ height: `${h * 10}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute -right-8 -bottom-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 rotate-12">
                                    <stat.icon size={160} strokeWidth={1} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Production Line & Masterpieces */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                        {/* Gallery - 2/3 Width */}
                        <section className="xl:col-span-2 space-y-10">
                            <div className="flex items-end justify-between border-b border-white/5 pb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                        <h2 className="text-2xl font-black text-white tracking-[0.1em] uppercase italic">Masterpiece Array</h2>
                                    </div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Inventory Density: {products.length} Active Vectors</p>
                                </div>
                                <button className="px-6 py-2.5 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">Export Matrix</button>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {products.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-32 text-center rounded-[4rem] bg-zinc-900/10 border-2 border-dashed border-white/5 flex flex-col items-center justify-center space-y-8"
                                        >
                                            <div className="w-24 h-24 rounded-[2rem] bg-zinc-950 flex items-center justify-center border border-white/5 text-zinc-800">
                                                <ImageIcon size={48} strokeWidth={1} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest leading-none mb-3 italic">Vault Empty</h3>
                                                <p className="text-sm text-zinc-700 font-medium italic mb-8">No visual entities found in the current spatial dimension.</p>
                                                <button onClick={handleAddArt} className="px-8 py-4 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-600/20 font-black uppercase text-xs tracking-widest hover:bg-blue-600 hover:text-white transition-all">Initialize Injection</button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        products.map((art, i) => (
                                            <motion.div
                                                key={art.id}
                                                layout
                                                initial={{ opacity: 0, x: -30 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="group p-1.5 pr-8 rounded-[2.5rem] bg-zinc-900/10 border border-white/5 flex items-center gap-10 hover:bg-zinc-900/30 hover:border-white/10 transition-all duration-500 shadow-xl"
                                            >
                                                <div className="w-40 h-40 rounded-[2rem] overflow-hidden border border-white/10 shrink-0 relative shadow-2xl">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                                    <img src={art.images?.[0] || '/placeholder-art.jpg'} alt={art.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-3" />
                                                    <div className="absolute inset-2 flex items-start justify-end z-20">
                                                        <div className={`px-3 py-1 rounded-xl backdrop-blur-xl border border-white/10 text-[9px] font-black uppercase tracking-widest shadow-2xl
                                                            ${art.status === 'approved' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'}
                                                        `}>
                                                            {art.status || 'approved'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-1 py-4">
                                                    <div className="flex flex-col gap-2 mb-6">
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/70 uppercase tracking-widest italic">
                                                            <span>{art.category}</span>
                                                            <div className="w-1 h-1 rounded-full bg-white/20" />
                                                            <span>ID: {art.id.slice(0, 8)}</span>
                                                        </div>
                                                        <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:translate-x-1 transition-transform">{art.name}</h3>
                                                    </div>

                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Valuation</p>
                                                            <p className="text-xl font-black text-white italic tracking-tight">₹{art.price.toLocaleString()}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Reach</p>
                                                            <p className="text-xl font-black text-white italic tracking-tight">{art.views || 0}</p>
                                                        </div>
                                                        <div className="space-y-1 hidden md:block">
                                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Acquisitions</p>
                                                            <p className="text-xl font-black text-emerald-400 italic tracking-tight">{art.sales || 0}</p>
                                                        </div>
                                                        <div className="space-y-1 hidden md:block">
                                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Intensity</p>
                                                            <div className="flex items-center gap-1.5 h-6">
                                                                {[1, 2, 3, 4].map(idx => (
                                                                    <div key={idx} className={`w-1 flex-1 h-${idx * 2} rounded-full ${idx <= 3 ? 'bg-blue-500/40' : 'bg-white/5'}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        onClick={() => handleViewArt(art)}
                                                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10 hover:-translate-x-1 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditArt(art)}
                                                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 hover:-translate-x-1 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <Pencil size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteArt(art.id)}
                                                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 hover:-translate-x-1 transition-all flex items-center justify-center group/btn"
                                                    >
                                                        <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </section>

                        {/* Intelligence Feed - 1/3 Width */}
                        <aside className="space-y-12">
                            {/* Performance Radar */}
                            <section className="p-10 rounded-[4rem] bg-zinc-900/10 border border-white/5 backdrop-blur-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

                                <h3 className="text-lg font-black text-white italic uppercase tracking-widest mb-10 flex items-center gap-3">
                                    <BarChart3 size={20} className="text-blue-500" /> Insight Feed
                                </h3>

                                <div className="space-y-8">
                                    {[
                                        { title: 'New Collector Acquired', time: '12m ago', desc: 'Mandal Art #04 added to collection', icon: Users, color: 'text-indigo-400' },
                                        { title: 'Visual Spike Detected', time: '1h ago', desc: 'Reach increased by 24% in Europe', icon: Zap, color: 'text-amber-400' },
                                        { title: 'Vector Sync Complete', time: '3h ago', desc: '6 assets moved to Public Matrix', icon: Check, color: 'text-emerald-400' },
                                        { title: 'Share Intensity Rising', time: '5h ago', desc: 'Active viral cycle initiated', icon: Share2, color: 'text-purple-400' },
                                    ].map((event, i) => (
                                        <div key={i} className="flex gap-4 relative group/event hover:translate-x-2 transition-transform duration-300">
                                            <div className={`w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 ring-1 ring-white/10 shrink-0 ${event.color}`}>
                                                <event.icon size={18} />
                                            </div>
                                            <div className="flex-1 border-b border-white/5 pb-6">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs font-black text-white italic tracking-tight">{event.title}</p>
                                                    <span className="text-[9px] font-bold text-zinc-600 uppercase">{event.time}</span>
                                                </div>
                                                <p className="text-[10px] font-medium text-zinc-500 italic">{event.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-12 h-14 rounded-[1.5rem] bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95">
                                    Access Signal Center <ArrowUpRight size={14} />
                                </button>
                            </section>

                            {/* Creator Profile Fragment */}
                            <section className="p-8 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-blue-700 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 mix-blend-overlay" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-[1.5rem] border-2 border-white/30 overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                        <img src={user?.profile?.avatar_url || 'https://i.pravatar.cc/100?img=12'} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white italic tracking-tighter uppercase">{user?.profile?.full_name || 'Creator'}</h4>
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest italic leading-none">Senior Artist Verified</p>
                                    </div>
                                    <button className="ml-auto p-3 rounded-xl bg-black/20 text-white hover:bg-black/40 transition-colors">
                                        <Settings size={18} />
                                    </button>
                                </div>
                            </section>
                        </aside>
                    </div>
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
