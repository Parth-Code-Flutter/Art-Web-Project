'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
    className?: string;
    variant?: 'rectangle' | 'circle' | 'text';
}

export default function Skeleton({ className = '', variant = 'rectangle' }: SkeletonProps) {
    const baseClass = "relative overflow-hidden bg-zinc-900/50 border border-white/5";

    // Variant styles
    const variantClasses = {
        rectangle: "rounded-2xl",
        circle: "rounded-full",
        text: "rounded-lg h-4 w-full"
    };

    return (
        <div className={`${baseClass} ${variantClasses[variant]} ${className}`}>
            {/* Shimmer effect */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shadow-[0_0_20px_rgba(255,255,255,0.02)]"
            />

            {/* Pulsing base */}
            <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-zinc-800/20"
            />
        </div>
    );
}

// Pre-defined Skeleton Blocks for easier use
export function ProductCardSkeleton() {
    return (
        <div className="group rounded-[2rem] bg-zinc-900/20 border border-white/5 p-2 flex flex-col gap-4">
            <Skeleton className="aspect-square rounded-[1.8rem]" />
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton className="h-2 w-12" />
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
