'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors duration-300">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* 404 Illustration */}
                    <div className="relative mb-8 text-center flex justify-center">
                        <div className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 leading-none select-none italic opacity-80">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Compass className="w-16 h-16 md:w-24 md:h-24 text-primary/10 animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
                        Artwork <span className="text-secondary opacity-30">Not Found</span>
                    </h1>
                    <p className="text-lg text-secondary mb-10 max-w-md mx-auto font-medium">
                        The masterpiece you're looking for seems to have wandered off to another gallery.
                        Let's get you back on track.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="group px-8 py-4 rounded-2xl bg-primary text-background font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3"
                        >
                            <Home size={18} />
                            Back to Home
                        </Link>
                        <Link
                            href="/customer/products"
                            className="px-8 py-4 rounded-2xl border border-zinc-200 dark:border-white/10 text-foreground font-black uppercase tracking-widest text-xs hover:bg-zinc-50 dark:hover:bg-white/5 transition-all flex items-center gap-3"
                        >
                            <Search size={18} />
                            Browse Gallery
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-16 pt-10 border-t border-zinc-100 dark:border-white/10">
                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 opacity-50">Popular Destinations</p>
                        <div className="flex flex-wrap gap-6 justify-center">
                            <Link href="/customer/products" className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider">
                                Products
                            </Link>
                            <Link href="/customer/categories" className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider">
                                Categories
                            </Link>
                            <Link href="/customer/about" className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider">
                                About Us
                            </Link>
                            <Link href="/customer/cart" className="text-xs font-bold text-secondary hover:text-primary transition-colors uppercase tracking-wider">
                                Cart
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
