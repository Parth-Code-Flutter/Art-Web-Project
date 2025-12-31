'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Admin Panel Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="mb-6 flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-amber-400" />
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold mb-3">
                        Admin Panel Error
                    </h2>
                    <p className="text-zinc-400 mb-6">
                        An error occurred in the admin panel. Please refresh or return to the dashboard.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-amber-500/20 text-left">
                            <p className="text-xs font-mono text-amber-400 mb-1">Error:</p>
                            <p className="text-xs font-mono text-zinc-400 break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={reset}
                            className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Retry
                        </button>
                        <Link
                            href="/creovo-admin-dec/vault"
                            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
