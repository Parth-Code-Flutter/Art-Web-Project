'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* 404 Illustration */}
                    <div className="relative mb-8">
                        <div className="text-[120px] md:text-[180px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 leading-none">
                            404
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Compass className="w-16 h-16 md:w-24 md:h-24 text-white/10 animate-spin" style={{ animationDuration: '8s' }} />
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Artwork Not Found
                    </h1>
                    <p className="text-lg text-zinc-400 mb-8 max-w-md mx-auto">
                        The masterpiece you're looking for seems to have wandered off to another gallery.
                        Let's get you back on track.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="/"
                            className="group px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                        <Link
                            href="/customer/products"
                            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                        >
                            <Search size={20} />
                            Browse Gallery
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-sm text-zinc-500 mb-4">Popular Destinations:</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/customer/products" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                Products
                            </Link>
                            <span className="text-zinc-700">•</span>
                            <Link href="/customer/categories" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                Categories
                            </Link>
                            <span className="text-zinc-700">•</span>
                            <Link href="/customer/about" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <span className="text-zinc-700">•</span>
                            <Link href="/customer/cart" className="text-sm text-zinc-400 hover:text-white transition-colors">
                                Cart
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
