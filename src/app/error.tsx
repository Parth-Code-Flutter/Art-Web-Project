'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Application Error:', error);
    }, [error]);

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Error Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="w-12 h-12 text-red-400" />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Something Went Wrong
                    </h1>
                    <p className="text-lg text-zinc-400 mb-2">
                        We encountered an unexpected error while loading this page.
                    </p>
                    <p className="text-sm text-zinc-500 mb-8">
                        Don't worry, our team has been notified and we're working on it.
                    </p>

                    {/* Error Details (Development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-8 p-4 rounded-xl bg-zinc-900/50 border border-red-500/20 text-left">
                            <p className="text-xs font-mono text-red-400 mb-2">Development Error Details:</p>
                            <p className="text-xs font-mono text-zinc-400 break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs font-mono text-zinc-600 mt-2">
                                    Digest: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={reset}
                            className="group px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                        >
                            <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            Try Again
                        </button>
                        <Link
                            href="/"
                            className="px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                        >
                            <Home size={20} />
                            Back to Home
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-sm text-zinc-500">
                            If this problem persists, please{' '}
                            <Link href="/customer/about" className="text-blue-400 hover:text-blue-300 transition-colors">
                                contact our support team
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
