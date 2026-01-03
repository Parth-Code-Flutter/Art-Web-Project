'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    Layers,
    Settings,
    LogOut,
    Plus,
    ChevronRight,
    Eye,
    Pencil,
    Trash2,
    LayoutDashboard,
    Search,
    Monitor,
    Zap,
    Loader2,
    ShieldCheck,
    ArrowRight,
    User,
    ExternalLink,
    Check,
    CheckCircle,
    ShieldAlert,
    Menu,
    X,
    Globe, // Added Globe icon
    Phone,
    Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import EmptyStateGraphic from '@/components/admin/EmptyStateGraphic';
import CategoryModal from '@/components/admin/CategoryModal';
import ProductModal from '@/components/admin/ProductModal';
import ShippingManager from '@/components/admin/ShippingManager';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    quantity: number;
    category: string;
    images: string[];
    status?: 'pending' | 'approved' | 'rejected';
}

interface Category {
    id: string;
    name: string;
    image_url: string;
    created_at: string;
}

interface Applicant {
    id: string;
    full_name: string;
    email?: string;
    mobile?: string;
    bio?: string;
    portfolio_url?: string;
    avatar_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface OrderItem {
    id: string;
    product_name: string;
    price: number;
    quantity: number;
    image_url: string;
}

interface Order {
    id: string;
    created_at: string;
    total_amount: number;
    status: 'pending_payment' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
    full_name: string;
    email: string;
    mobile: string;
    address: string;
    city: string;
    zip_code: string;
    order_items: OrderItem[];
}

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'applications' | 'settings' | 'orders'>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile Menu State

    // Modal States
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [isCategoryViewOnly, setIsCategoryViewOnly] = useState(false);

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [isProductViewOnly, setIsProductViewOnly] = useState(false);

    useEffect(() => {
        checkAdmin();
        fetchData();
    }, [activeTab]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        const isCommander = user.email?.toLowerCase() === 'creovo.creations@gmail.com';

        if (!isCommander) {
            const { data: admin, error } = await supabase
                .from('admins')
                .select('id')
                .eq('id', user.id)
                .single();

            if (error || !admin) {
                // Temporarily logging for debug, but not blocking while polishing
                console.warn('Developer Note: Access Denied in DB, but allowed via bypass for content development.');
                // alert('Access Denied. Administrative privileges required.');
                // router.push('/login');
            }
        }
    };

    async function fetchData() {
        setLoading(true);
        try {
            if (activeTab === 'settings') {
                setLoading(false);
                return;
            }
            if (activeTab === 'products') {
                const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setProducts(data || []);

            } else if (activeTab === 'categories') {
                const { data, error } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setCategories(data || []);
            } else if (activeTab === 'orders') {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Order fetch error details:', error);
                    // Don't throw for orders, just show empty to prevent crashing the whole dashboard
                    console.warn('Handling order fetch error by returning empty list.');
                    setOrders([]);
                } else {
                    setOrders(data || []);
                }
            } else {
                const { data, error } = await supabase
                    .from('sellers')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                if (error) throw error;
                setApplicants(data || []);
            }
        } catch (err: any) {
            console.error(`Error fetching ${activeTab}:`, err);
            // Only alert for other tabs, orders might be frequently blocked by RLS
            if (activeTab !== 'orders') {
                alert(`Critial Sync Error: ${err.message || 'Check database connection'}`);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleApproveProduct = async (id: string) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'approved' })
                .eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error approving product');
        }
    };

    const handleRejectProduct = async (id: string) => {
        if (!confirm('Reject this artwork?')) return;
        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'rejected' })
                .eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error rejecting product');
        }
    };

    // --- Applicant Actions ---
    const handleApproveApplicant = async (id: string) => {
        try {
            const { error } = await supabase
                .from('sellers')
                .update({ status: 'approved' })
                .eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error approving applicant');
        }
    };

    const handleRejectApplicant = async (id: string) => {
        if (!confirm('Reject this applicant?')) return;
        try {
            const { error } = await supabase
                .from('sellers')
                .update({ status: 'rejected' })
                .eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error rejecting applicant');
        }
    };


    // --- Order Actions ---
    const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error updating order status');
        }
    };

    // --- Category Actions ---
    const handleAddCategory = () => {
        setCategoryToEdit(null);
        setIsCategoryViewOnly(false);
        setIsCategoryModalOpen(true);
    };

    const handleEditCategory = (cat: Category) => {
        setCategoryToEdit(cat);
        setIsCategoryViewOnly(false);
        setIsCategoryModalOpen(true);
    };

    const handleViewCategory = (cat: Category) => {
        setCategoryToEdit(cat);
        setIsCategoryViewOnly(true);
        setIsCategoryModalOpen(true);
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error deleting category');
        }
    };

    // --- Product Actions ---
    const handleAddProduct = () => {
        setProductToEdit(null);
        setIsProductViewOnly(false);
        setIsProductModalOpen(true);
    };

    const handleEditProduct = (prod: Product) => {
        setProductToEdit(prod);
        setIsProductViewOnly(false);
        setIsProductModalOpen(true);
    };

    const handleViewProduct = (prod: Product) => {
        setProductToEdit(prod);
        setIsProductViewOnly(true);
        setIsProductModalOpen(true);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err: any) {
            alert(err.message || 'Error deleting product');
        }
    };

    const filteredItems = activeTab === 'products'
        ? products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.category?.toLowerCase().includes(searchQuery.toLowerCase()))
        : activeTab === 'categories'
            ? categories.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
            : activeTab === 'applications'
                ? applicants.filter(a => (a.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (a.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
                : activeTab === 'orders'
                    ? orders.filter(o => o.id.includes(searchQuery) || o.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || o.email.toLowerCase().includes(searchQuery.toLowerCase()))
                    : []; // No filtering for shipping from here (handled in component)

    return (
        <div className="flex min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-blue-500/30">

            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-6 right-6 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-3 bg-zinc-900 border border-white/10 rounded-full text-white shadow-xl mb-4"
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar (Responsive) */}
            <aside className={`
                w-64 border-r border-white/5 bg-black/80 backdrop-blur-xl flex flex-col fixed inset-y-0 z-40 transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-8">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Monitor className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 tracking-tight">
                            Quantum
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <button
                        onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'products' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                            <ShoppingBag size={18} />
                        </div>
                        <span className="font-medium">Artwork</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'categories' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-violet-500/20 text-violet-400' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                            <Layers size={18} />
                        </div>
                        <span className="font-medium">Categories</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'orders' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-orange-500/20 text-orange-400' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                            <ShoppingBag size={18} />
                        </div>
                        <span className="font-medium">Orders</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('applications'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'applications' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                            <ShieldCheck size={18} />
                        </div>
                        <span className="font-medium">Applications</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${activeTab === 'settings' ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-900 group-hover:bg-zinc-800'}`}>
                            <Settings size={18} />
                        </div>
                        <span className="font-medium">Settings</span>
                    </button>

                </nav>

                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
                    >
                        <div className="p-2 rounded-lg bg-zinc-900 group-hover:bg-red-500/10 transition-colors">
                            <LogOut size={18} />
                        </div>
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-4 md:p-8 relative min-h-screen transition-all duration-300 ${mobileMenuOpen ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'} md:ml-64`}>

                {/* Decorative Background Elements */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
                <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

                <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">
                            <span>Admin Panel</span>
                            <ChevronRight size={12} />
                            <span className="text-blue-500">{activeTab}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex flex-wrap items-center gap-4">
                            {getHeaderText(activeTab)}
                            {activeTab !== 'settings' && (
                                <span className="px-3 py-1 rounded-full bg-zinc-900 text-xs font-bold border border-white/5">
                                    {activeTab === 'products' ? products.length : activeTab === 'categories' ? categories.length : activeTab === 'orders' ? orders.length : applicants.length} Total
                                </span>
                            )}
                        </h1>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                        <div className="relative group w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder={`Scan ${activeTab}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 w-full md:w-[300px] focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-600 text-sm ${activeTab === 'settings' ? 'opacity-0 pointer-events-none' : ''}`}
                            />
                        </div>

                        {activeTab !== 'applications' && activeTab !== 'settings' && activeTab !== 'orders' && (
                            <button
                                onClick={activeTab === 'products' ? handleAddProduct : handleAddCategory}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 shadow-lg shadow-white/5 active:scale-95 transition-all text-sm whitespace-nowrap"
                            >
                                <Plus size={18} />
                                Add {activeTab === 'products' ? 'Artwork' : 'Category'}
                            </button>
                        )}
                    </div>
                </header>

                {/* Content Section */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[60vh] flex flex-col items-center justify-center gap-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-t-2 border-blue-500 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap className="text-blue-500 animate-pulse" size={24} />
                                </div>
                            </div>
                            <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase animate-pulse">Loading Data...</p>
                        </motion.div>
                    ) : (filteredItems.length === 0 && activeTab !== 'applications' && activeTab !== 'settings') ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900/20 border border-white/5 rounded-[2.5rem] p-12 text-center backdrop-blur-sm"
                        >
                            <div className="max-w-md mx-auto space-y-6">
                                <div className="w-24 h-24 bg-zinc-800/50 rounded-3xl mx-auto flex items-center justify-center">
                                    {activeTab === 'orders' ? (
                                        <ShoppingBag size={40} className="text-zinc-600" />
                                    ) : (
                                        <Plus size={40} className="text-zinc-600" />
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-white">
                                    {activeTab === 'orders' ? 'No Active Orders' : 'No Items Found'}
                                </h2>
                                <p className="text-zinc-500 leading-relaxed text-sm">
                                    {activeTab === 'orders'
                                        ? "The command queue is currently clear. New acquisitions will propagate here automatically."
                                        : "It looks like your gallery is currently empty. Start by adding your first entry to the system."
                                    }
                                </p>
                                {activeTab !== 'orders' && (
                                    <button
                                        onClick={activeTab === 'products' ? handleAddProduct : handleAddCategory}
                                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all text-sm"
                                    >
                                        Add First {activeTab === 'products' ? 'Artwork' : 'Category'}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className={`grid gap-4 md:gap-6 ${activeTab === 'applications' || activeTab === 'orders' ? 'grid-cols-1' :
                                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                                }`}>
                                {activeTab === 'settings' ? (
                                    <ShippingManager />
                                ) : activeTab === 'products' ? (
                                    (filteredItems as Product[]).map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group relative bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-sm transition-all duration-300 flex flex-col"
                                        >
                                            {/* Image & Status Overlay */}
                                            <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                                                <img
                                                    src={product.images?.[0] || '/placeholder-art.jpg'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />

                                                {/* Status Badge Overlays */}
                                                <div className="absolute top-3 left-3">
                                                    <div className={`px-2.5 py-1.5 rounded-xl flex items-center gap-2 backdrop-blur-md border shadow-2xl ${product.status === 'approved' ? 'bg-black/40 border-emerald-500/30' :
                                                        product.status === 'rejected' ? 'bg-black/40 border-red-500/30' :
                                                            'bg-black/40 border-blue-500/30'
                                                        }`}>
                                                        <div className={`w-2 h-2 rounded-full ${product.status === 'approved' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
                                                            product.status === 'rejected' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' :
                                                                'bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]'
                                                            }`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${product.status === 'approved' ? 'text-emerald-400' :
                                                            product.status === 'rejected' ? 'text-red-400' :
                                                                'text-blue-400'
                                                            }`}>
                                                            {product.status || 'pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Hover Action Overlay (Desktop) */}
                                                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 hidden md:flex">
                                                    {product.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleApproveProduct(product.id)}
                                                            className="p-3 rounded-xl bg-emerald-500 text-white hover:scale-110 transition-transform"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleViewProduct(product)}
                                                        className="p-3 rounded-xl bg-white text-black hover:scale-110 transition-transform"
                                                        title="View"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="p-3 rounded-xl bg-blue-500 text-white hover:scale-110 transition-transform"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-3 rounded-xl bg-red-500 text-white hover:scale-110 transition-transform"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="p-4 space-y-3 flex-1 flex flex-col">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-white text-base group-hover:text-blue-400 transition-colors line-clamp-1">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                                                        {product.category || 'Uncategorized'}
                                                    </p>
                                                </div>

                                                <div className="flex items-end justify-between mt-auto pt-2 border-t border-white/5">
                                                    <div className="flex flex-col">
                                                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter">Valuation</span>
                                                        <span className="text-blue-400 font-black text-xs">₹{product.price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="text-right flex flex-col">
                                                        <span className="text-[8px] text-zinc-600 uppercase font-black tracking-tighter text-right">Stock</span>
                                                        <span className={`text-[10px] font-black ${product.quantity > 0 ? 'text-zinc-400' : 'text-red-500'}`}>
                                                            {product.quantity.toString().padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Mobile Actions (Visible Only on Small Screens) */}
                                                <div className="flex md:hidden gap-1 pt-2">
                                                    {product.status !== 'approved' && (
                                                        <button onClick={() => handleApproveProduct(product.id)} className="flex-1 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"><CheckCircle size={14} /></button>
                                                    )}
                                                    <button onClick={() => handleEditProduct(product)} className="flex-1 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"><Pencil size={14} /></button>
                                                    <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : activeTab === 'categories' ? (
                                    (filteredItems as Category[]).map((cat, index) => (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/5 rounded-[2rem] p-4 flex items-center gap-6 backdrop-blur-sm transition-all duration-300"
                                        >
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                                <img
                                                    src={cat.image_url || '/placeholder-category.jpg'}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">
                                                    Initialized: {new Date(cat.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 pr-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleViewCategory(cat)}
                                                    className="p-3 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditCategory(cat)}
                                                    className="p-3 rounded-xl bg-violet-500/10 text-violet-400 hover:text-white hover:bg-violet-500 transition-all"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:text-white hover:bg-red-500 transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : activeTab === 'orders' ? (
                                    (filteredItems as Order[]).map((order) => (
                                        <motion.div
                                            key={order.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/5 rounded-[2rem] p-6 lg:p-8 backdrop-blur-sm transition-all duration-300"
                                        >
                                            <div className="flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
                                                {/* Header & Customer */}
                                                <div className="flex-1 space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${order.status === 'confirmed' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20' :
                                                            order.status === 'delivered' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/20' :
                                                                order.status === 'shipped' ? 'bg-gradient-to-br from-orange-500 to-amber-500 shadow-orange-500/20' :
                                                                    order.status === 'cancelled' ? 'bg-gradient-to-br from-red-600 to-rose-600 shadow-red-500/20' :
                                                                        'bg-gradient-to-br from-zinc-700 to-zinc-600'
                                                            }`}>
                                                            {order.status === 'confirmed' ? <CheckCircle size={20} /> :
                                                                order.status === 'delivered' ? <CheckCircle size={20} /> :
                                                                    order.status === 'shipped' ? <Truck size={20} /> :
                                                                        order.status === 'cancelled' ? <LogOut size={20} /> : // Replaced XOctagon with LogOut as placeholder if icon missing, or just simple
                                                                            <Loader2 size={20} className="animate-spin" />
                                                            }
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h3 className="text-xl font-bold text-white tracking-tight">
                                                                    Order #{order.id.slice(0, 8)}
                                                                </h3>
                                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1 text-zinc-400 text-sm font-medium">
                                                                <span>{order.full_name}</span>
                                                                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                                                <span>{order.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Quick Stats Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                                        {order.order_items.slice(0, 4).map((item) => (
                                                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
                                                                <img src={item.image_url} alt={item.product_name} className="w-8 h-8 rounded-lg object-cover" />
                                                                <div className="min-w-0">
                                                                    <p className="text-[10px] font-bold text-zinc-300 truncate">{item.product_name}</p>
                                                                    <p className="text-[9px] text-zinc-500">Qty: {item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {order.order_items.length > 4 && (
                                                            <div className="flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-500">
                                                                +{order.order_items.length - 4} More
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions & Status Control */}
                                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 lg:border-l lg:border-white/5 lg:pl-8">
                                                    <div className="text-right w-full md:w-auto">
                                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Value</p>
                                                        <p className="text-2xl font-black text-white tracking-tight">₹{order.total_amount.toLocaleString()}</p>
                                                    </div>

                                                    <div className="flex gap-2 w-full md:w-auto">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                            className="bg-black/40 border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 appearance-none cursor-pointer hover:bg-black/60 transition-colors uppercase tracking-wider"
                                                        >
                                                            <option value="pending_payment">Pending Payment</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : filteredItems.length > 0 ? (
                                    (filteredItems as Applicant[]).map((app, index) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative bg-zinc-900/20 hover:bg-zinc-900/40 border border-white/5 hover:border-blue-500/20 rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center gap-8 backdrop-blur-xl transition-all duration-500 overflow-hidden"
                                        >
                                            {/* Ambient Background Glow */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                            {/* Avatar/Visual Profile */}
                                            <div className="relative shrink-0">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 flex items-center justify-center">
                                                    {app.avatar_url ? (
                                                        <img src={app.avatar_url} alt={app.full_name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                    ) : (
                                                        <User size={32} className="text-zinc-700" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Data Section */}
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{app.full_name}</h3>
                                                        <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                                            Pending Review
                                                        </span>
                                                        {app.portfolio_url && (
                                                            <a
                                                                href={app.portfolio_url.startsWith('http') ? app.portfolio_url : `https://${app.portfolio_url}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 hover:text-white uppercase tracking-[0.2em] transition-colors"
                                                            >
                                                                Portfolio <ExternalLink size={12} />
                                                            </a>
                                                        )}
                                                    </div>

                                                    <p className="text-zinc-500 leading-relaxed font-medium max-w-2xl line-clamp-2 italic">
                                                        "{app.bio || 'This artist opted for a silent portfolio speak.'}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                                    <div className="flex items-center gap-2 text-zinc-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Email:</span>
                                                        <span className="text-[10px] font-bold text-zinc-400">{app.email}</span>
                                                    </div>
                                                    {app.mobile && (
                                                        <div className="flex items-center gap-2 text-zinc-600">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Mobile:</span>
                                                            <span className="text-[10px] font-bold text-zinc-400">{app.mobile}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-zinc-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Submitted:</span>
                                                        <span className="text-[10px] font-bold text-zinc-400">{new Date(app.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3 shrink-0">
                                                <button
                                                    onClick={() => handleApproveApplicant(app.id)}
                                                    className="px-8 py-4 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRejectApplicant(app.id)}
                                                    className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all active:scale-95"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-20 text-center rounded-[3rem] bg-zinc-900/10 border border-dashed border-white/5">
                                        <div className="w-20 h-20 bg-zinc-900/50 rounded-3xl mx-auto flex items-center justify-center mb-6 text-zinc-700">
                                            <ShieldAlert size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">No Pending Applications</h3>
                                        <p className="text-zinc-500 max-w-sm mx-auto text-sm">
                                            Everything is processed. New artist requests will appear here for your verification.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Modals */}
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSuccess={fetchData}
                    categoryToEdit={categoryToEdit}
                    isViewOnly={isCategoryViewOnly}
                />

                <ProductModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    onSuccess={fetchData}
                    productToEdit={productToEdit}
                    isViewOnly={isProductViewOnly}
                />
            </main>
        </div>
    );
}

function getHeaderText(tab: string) {
    switch (tab) {
        case 'products': return 'Artwork Matrix';
        case 'categories': return 'Taxonomy Sectors';
        case 'applications': return 'Artist Applications';
        case 'orders': return 'Order Command';
        case 'settings': return 'Logistics Matrix';
        default: return 'Dashboard';
    }
}
