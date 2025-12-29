'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShoppingBag, LayoutGrid, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BentoHero() {
    const itemClasses = "relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:border-white/10 hover:bg-zinc-900/60 shadow-xl group";
    const badgeClasses = "w-fit flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-zinc-300 border border-white/5 mb-4 group-hover:bg-white/10 transition-colors";

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[240px]">

                {/* 1. Dynamic Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`${itemClasses} md:col-span-2 lg:col-span-2`}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div>
                        <div className={badgeClasses}>
                            <Sparkles size={12} className="text-yellow-400" />
                            <span>Exclusive Early Access</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-white leading-tight">
                            Good Morning, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-bold">Isabella Chen.</span>
                        </h1>
                    </div>
                    <p className="text-zinc-400 max-w-sm mt-4">
                        Your reserved preview of the <span className="text-white font-medium">"Neon Horizons"</span> collection expires in 4 hours.
                    </p>
                </motion.div>

                {/* 2. Collection Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`${itemClasses} md:col-span-1`}
                >
                    <div className={badgeClasses}>
                        <ShoppingBag size={12} /> My Activity
                    </div>
                    <div>
                        <h3 className="text-zinc-400 font-medium">Active Bids</h3>
                        <div className="text-4xl font-heading font-bold text-white mt-2">3</div>
                        <p className="text-xs text-green-400 mt-1 font-medium">● Highest Bidder on 2</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mt-auto group-hover:translate-x-1 duration-300">
                        View Bids <ArrowRight size={14} />
                    </button>
                </motion.div>

                {/* 3. Featured Artwork Card - Large Image */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`${itemClasses} md:col-span-3 lg:col-span-1 lg:row-span-2 !p-0`}
                >
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/aurora.png"
                            alt="Aurora II"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-end p-6">
                        <div className="bg-black/50 backdrop-blur-sm border border-white/10 p-4 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Featured</span>
                                <span className="text-xs text-zinc-400">By Elara Vance</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Aurora II</h2>
                            <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-colors">
                                View Piece
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Category Highlight */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`${itemClasses} md:col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-900/20 to-purple-900/20`}
                >
                    <div className={badgeClasses}>
                        <LayoutGrid size={12} /> Curated
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Modern Abstract</h3>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            "Chaos in Order" — A curated selection of 2,400+ works challenging traditional boundaries.
                        </p>
                    </div>
                    <button className="flex items-center justify-between w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors mt-4">
                        <span className="text-sm font-medium text-white">Start Exploring</span>
                        <ArrowRight size={16} className="text-white/60" />
                    </button>
                </motion.div>

                {/* 5. Artist Community */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`${itemClasses} md:col-span-1 lg:col-span-2`}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className={badgeClasses}>
                                <Users size={12} /> Community
                            </div>
                            <h3 className="text-xl font-bold text-white">Artists You Follow</h3>
                        </div>
                        <div className="flex -space-x-3">
                            {['JD', 'AS', 'MK'].map((initial, i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-zinc-300 font-medium tracking-wider">
                                    {initial}
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-[#0a0a0a] flex items-center justify-center text-xs text-white font-medium">
                                +45
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="text-4xl font-heading font-bold text-white">48</div>
                        <p className="text-sm text-zinc-500 mt-1">
                            <span className="text-white font-medium">Sarah Jenkins</span> and 2 others posted new work today.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
