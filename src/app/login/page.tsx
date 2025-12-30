'use client';

import React, { useState } from 'react';
import { Palette, ShoppingBag, ArrowRight } from 'lucide-react';
import CustomerAuth from '@/components/customer/CustomerAuth';

export default function LoginPage() {
    // Customer Auth State
    const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

    return (
        <main className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#3b82f622_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_100%_100%,#8b5cf622_0%,transparent_50%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-4xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side: Brand */}
                <div className="md:w-5/12 bg-black/40 p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                    <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg mb-6">
                            <Palette size={24} />
                        </div>
                        <h1 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">ArtGallery</h1>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            A sanctuary for the modern connoisseur. Discover, collect, and manage visionary masterpieces in an immersive digital space.
                        </p>
                    </div>

                    <div className="relative text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-12 md:mt-0">
                        © {new Date().getFullYear()} ArtGallery Inc.
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-zinc-950/20">
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-zinc-500 mb-8 text-sm">Please select your destination to continue.</p>

                        <button
                            onClick={() => setIsCustomerAuthOpen(true)}
                            className="w-full group p-8 rounded-[2rem] bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-blue-500/30 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)] transition-all text-left flex items-center gap-8"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500">
                                <ShoppingBag size={28} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Explore Gallery</h3>
                                <p className="text-sm text-zinc-500 mt-1">Access your curated collection and private bids.</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>

                        <div className="pt-8 mt-8 border-t border-white/5">
                            <p className="text-center text-xs text-zinc-600 font-medium">
                                Technical support: <span className="text-zinc-400">support@artgallery.com</span>
                            </p>
                        </div>
                    </div>
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
