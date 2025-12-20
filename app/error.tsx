"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mb-2">Something went wrong!</h2>
            <p className="text-zinc-400 mb-8 max-w-sm">
                We encountered an error loading this page. Please try again or return home.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
