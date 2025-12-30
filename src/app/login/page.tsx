'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, LayoutDashboard, ShoppingBag, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CustomerAuth from '@/components/customer/CustomerAuth';

export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = useState<'selection' | 'admin'>('selection');
    const [isAdminLoading, setIsAdminLoading] = useState(false);

    // Admin Login Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Customer Auth State
    const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAdminLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Success - Next.js Middleware will now allow access to /admin
            // Use window.location.href to force a full refresh so middleware sees the cookies
            window.location.href = '/admin';
        } catch (err: any) {
            console.error('Admin login error:', err.message || err);
            alert(err.message || 'Invalid Admin Credentials');
        } finally {
            setIsAdminLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#3b82f633_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,#8b5cf633_0%,transparent_50%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]">
                {/* Left Side: Brand */}
                <div className="md:w-5/12 bg-black/40 p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-6">
                            <Palette size={24} />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">ArtGallery</h1>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            A sanctuary for the modern connoisseur. Discover, collect, and manage visionary masterpieces.
                        </p>
                    </div>

                    <div className="relative text-xs text-zinc-600 mt-12 md:mt-0">
                        © {new Date().getFullYear()} ArtGallery Inc.
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
                    {view === 'selection' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-8">Choose your portal</h2>

                            <button
                                onClick={() => setIsCustomerAuthOpen(true)}
                                className="w-full group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg transition-all text-left flex items-center gap-6"
                            >
                                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <ShoppingBag size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Explore Gallery</h3>
                                    <p className="text-sm text-zinc-400 mt-1">Discover and purchase exclusive artworks</p>
                                </div>
                                <ArrowRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </button>

                            <button
                                onClick={() => setView('admin')}
                                className="w-full group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 hover:shadow-lg transition-all text-left flex items-center gap-6"
                            >
                                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <LayoutDashboard size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">Admin Portal</h3>
                                    <p className="text-sm text-zinc-400 mt-1">Manage your gallery and inventory</p>
                                </div>
                                <ArrowRight className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    ) : (
                        <div className="w-full max-w-md mx-auto">
                            <button
                                onClick={() => setView('selection')}
                                className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 mb-8 transition-colors"
                            >
                                ← Back to selection
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-2">Admin Access</h2>
                            <p className="text-zinc-400 mb-8 text-sm">Secure entry for gallery managers.</p>

                            <form className="space-y-4" onSubmit={handleAdminLogin}>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        placeholder="admin@artgallery.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all outline-none"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors mt-4 shadow-lg shadow-white/5"
                                    disabled={isAdminLoading}
                                >
                                    {isAdminLoading ? 'Authenticating...' : 'Secure Login'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Customer Authentication Modal */}
            <CustomerAuth
                isOpen={isCustomerAuthOpen}
                onClose={() => setIsCustomerAuthOpen(false)}
            />
        </main>
    );
}
