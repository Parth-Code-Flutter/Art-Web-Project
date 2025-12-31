import React from 'react';
import { Loader2, Palette } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto">
                        <Palette className="w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-20 h-20 text-blue-500/30 animate-spin" />
                    </div>
                </div>
                <p className="text-zinc-400 font-medium">Loading gallery...</p>
            </div>
        </div>
    );
}
