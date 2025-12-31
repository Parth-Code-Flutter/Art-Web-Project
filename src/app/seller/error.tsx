'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Store } from 'lucide-react';

export default function SellerError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Seller Dashboard Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 pt-20">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-purple-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Dashboard Error
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        We encountered an issue loading your seller dashboard. Please try again.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                        <Link
                            href="/seller/dashboard"
                            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <Store size={18} />
                            Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
