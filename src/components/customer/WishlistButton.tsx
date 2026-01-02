'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
    productId: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'icon' | 'button';
    className?: string;
    showText?: boolean;
}

export default function WishlistButton({
    productId,
    size = 'md',
    variant = 'icon',
    className = '',
    showText = false
}: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const inWishlist = isInWishlist(productId);

    // Size configurations
    const sizeConfig = {
        sm: {
            button: 'w-8 h-8',
            icon: 16,
            text: 'text-xs'
        },
        md: {
            button: 'w-10 h-10',
            icon: 20,
            text: 'text-sm'
        },
        lg: {
            button: 'w-12 h-12',
            icon: 24,
            text: 'text-base'
        }
    };

    const config = sizeConfig[size];

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLoading) return;

        setIsLoading(true);
        setIsAnimating(true);

        try {
            await toggleWishlist(productId);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    if (variant === 'button') {
        return (
            <motion.button
                onClick={handleClick}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                    relative px-4 py-2 rounded-xl font-bold
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${inWishlist
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                        : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}
            >
                {isLoading ? (
                    <Loader2 size={config.icon} className="animate-spin" />
                ) : (
                    <>
                        <motion.div
                            animate={isAnimating ? {
                                scale: [1, 1.3, 1],
                                rotate: [0, -10, 10, 0]
                            } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <Heart
                                size={config.icon}
                                className={`transition-all duration-300 ${inWishlist ? 'fill-current' : ''
                                    }`}
                            />
                        </motion.div>
                        {showText && (
                            <span className={config.text}>
                                {inWishlist ? 'Saved' : 'Save'}
                            </span>
                        )}
                    </>
                )}

                {/* Particle effect on add */}
                <AnimatePresence>
                    {isAnimating && inWishlist && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: Math.cos((i * Math.PI * 2) / 6) * 20,
                                        y: Math.sin((i * Math.PI * 2) / 6) * 20,
                                    }}
                                    exit={{ scale: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="absolute w-1 h-1 bg-red-500 rounded-full"
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>
            </motion.button>
        );
    }

    // Icon variant (default)
    return (
        <motion.button
            onClick={handleClick}
            disabled={isLoading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`
                relative ${config.button} rounded-full
                flex items-center justify-center
                transition-all duration-300
                ${inWishlist
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                    : 'bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isLoading ? (
                <Loader2 size={config.icon} className="animate-spin" />
            ) : (
                <motion.div
                    animate={isAnimating ? {
                        scale: [1, 1.4, 1],
                        rotate: [0, -15, 15, 0]
                    } : {}}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    <Heart
                        size={config.icon}
                        className={`transition-all duration-300 ${inWishlist ? 'fill-current' : ''
                            }`}
                        strokeWidth={2.5}
                    />
                </motion.div>
            )}

            {/* Ripple effect */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.8 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`absolute inset-0 rounded-full border-2 ${inWishlist ? 'border-red-500' : 'border-white'
                            }`}
                    />
                )}
            </AnimatePresence>

            {/* Particle burst effect */}
            <AnimatePresence>
                {isAnimating && inWishlist && (
                    <>
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                animate={{
                                    scale: [0, 1, 0.5],
                                    x: Math.cos((i * Math.PI * 2) / 8) * 25,
                                    y: Math.sin((i * Math.PI * 2) / 8) * 25,
                                    opacity: [1, 1, 0]
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute w-1.5 h-1.5 bg-red-500 rounded-full"
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Glow effect when in wishlist */}
            {inWishlist && !isLoading && (
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-md -z-10 animate-pulse" />
            )}
        </motion.button>
    );
}
