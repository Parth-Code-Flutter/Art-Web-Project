'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Palette,
    ShieldCheck,
    BarChart3,
    Settings,
    LogOut,
    ChevronRight,
    Bell,
    Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/creovo-admin-dec/vault' },
    { name: 'Products', icon: ShoppingBag, href: '/creovo-admin-dec/vault/products' },
    { name: 'Categories', icon: Layers, href: '/creovo-admin-dec/vault/categories' },
    { name: 'Orders', icon: ShoppingBag, href: '/creovo-admin-dec/vault/orders' },
    { name: 'Artists', icon: Palette, href: '/creovo-admin-dec/vault/artists' },
    { name: 'Customers', icon: Users, href: '/creovo-admin-dec/vault/collectors' },
    { name: 'Analytics', icon: BarChart3, href: '/creovo-admin-dec/vault/analytics' },
    { name: 'Security', icon: ShieldCheck, href: '/creovo-admin-dec/vault/security' },
];

interface AdminSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed left-0 top-0 h-screen w-72 bg-white dark:bg-[#050505] border-r border-zinc-200 dark:border-white/5 z-50 flex flex-col transition-all duration-500 ease-in-out
                ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Admin Brand */}
                <div className="p-8 pb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-black shadow-2xl">
                            <Layers size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-foreground">Creovo</h1>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] -mt-1 opacity-50">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Admin Stats Quick Look */}
                <div className="px-6 mb-8">
                    <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-widest">System Status</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        </div>
                        <p className="text-lg font-black italic text-foreground tracking-tighter">ONLINE</p>
                    </div>
                </div>

                {/* Navigation Registry */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
                    <p className="px-4 text-[9px] font-black text-secondary uppercase tracking-[0.3em] mb-4 opacity-50">Main Menu</p>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                                    ${isActive
                                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl shadow-black/10'
                                        : 'text-secondary hover:text-foreground hover:bg-zinc-100 dark:hover:bg-white/5'}
                                `}
                            >
                                <Icon size={18} className={`${isActive ? '' : 'opacity-40 group-hover:opacity-100 transition-opacity'}`} />
                                <span className="text-xs font-bold tracking-wide">{item.name}</span>
                                {isActive && (
                                    <ChevronRight size={14} className="ml-auto opacity-50" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Tools */}
                <div className="p-6 border-t border-zinc-100 dark:border-white/5 space-y-4">
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-secondary hover:text-foreground transition-colors group text-left">
                        <Settings size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-xs font-bold">System Config</span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-4 py-3 text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all group text-left">
                        <LogOut size={18} />
                        <span className="text-xs font-bold">Terminate Session</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
