'use client';

import React, { useEffect, useState, use } from 'react';
import {
    ShoppingBag,
    ArrowLeft,
    ArrowRight,
    Loader2,
    X,
    CreditCard,
    ShieldCheck,
    Truck,
    Clock,
    ZoomIn,
    Check,
    Share2,
    Heart,
    Maximize2,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWishlist } from '@/contexts/WishlistContext';
import VirtualMockup from '@/components/customer/VirtualMockup';
import ShareModal from '@/components/customer/ShareModal';
import WishlistButton from '@/components/customer/WishlistButton';
import Skeleton, { ProductCardSkeleton } from '@/components/ui/Skeleton';

interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
    artist?: string;
}

export default function ProductDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const [isMockupOpen, setIsMockupOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!isZoomOpen) {
            setZoomScale(1);
        }
    }, [isZoomOpen]);

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    profiles:seller_id (id, full_name)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);

            // Increment views
            await supabase.rpc('increment_product_views', { product_id: id });
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleZoom = (type: 'in' | 'out') => {
        setZoomScale(prev => {
            const newScale = type === 'in' ? prev + 0.5 : prev - 0.5;
            return Math.min(Math.max(newScale, 1), 4);
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: product?.name || 'Art Gallery',
            text: `Check out this masterpiece: ${product?.name}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setIsShareOpen(true);
                }
            }
        } else {
            setIsShareOpen(true);
        }
    };

    const addToCart = () => {
        if (!product) return;
        setAddingToCart(true);

        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);

        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            currentCart.push({ ...product, quantity });
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('cartUpdated'));
        setTimeout(() => setAddingToCart(false), 2000);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pt-20 pb-20 px-4 md:px-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Media Skeleton */}
                        <div className="space-y-6">
                            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                            <div className="flex gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="w-24 h-24 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Info Skeleton */}
                        <div className="flex flex-col h-full space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-24 rounded-full" />
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>

                            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 space-y-6 shadow-sm dark:shadow-none">
                                <Skeleton className="h-12 w-1/3" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-14 w-32 rounded-xl" />
                                    <Skeleton className="h-14 flex-1 rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-14 rounded-xl" />
                                    <Skeleton className="h-14 rounded-xl" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Skeleton className="h-8 w-1/3" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!product) return null;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pt-20 pb-20 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Media Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6"
                    >
                        <div
                            className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 group cursor-zoom-in border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors"
                            onClick={() => setIsZoomOpen(true)}
                        >
                            <img
                                src={product.images[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsZoomOpen(true); }}
                                    className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all border border-white/10"
                                >
                                    <ZoomIn size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMockupOpen(true); }}
                                    className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all border border-white/10 group/mockup"
                                    title="View In Room"
                                >
                                    <Maximize2 size={20} className="group-hover/mockup:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.section>

                    {/* Info Section */}
                    <motion.section
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="mb-8 border-b border-zinc-200 dark:border-white/10 pb-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider uppercase border border-blue-200 dark:border-blue-500/20">
                                    {product.category}
                                </span>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleShare}
                                        className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <Share2 size={18} />
                                    </button>
                                    <WishlistButton
                                        productId={product.id}
                                        size="md"
                                        className="bg-zinc-100 dark:bg-zinc-900"
                                    />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-product-title font-bold text-zinc-900 dark:text-white mb-2 leading-tight">
                                {product.name}
                            </h1>
                            <button
                                onClick={() => (product as any).profiles?.id && router.push(`/artists/${(product as any).profiles.id}`)}
                                className="text-zinc-500 dark:text-zinc-400 text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group/artist"
                            >
                                By {(product as any).profiles?.full_name || 'Curated Artist'}
                                <ArrowRight size={14} className="opacity-0 group-hover/artist:opacity-100 group-hover/artist:translate-x-1 transition-all" />
                            </button>
                        </div>

                        {/* Price & Cart */}
                        <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-2xl p-6 mb-8 shadow-sm dark:shadow-none">
                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-4xl font-bold font-price text-zinc-900 dark:text-white tracking-tight">
                                    {formatPrice(product.discount_price || product.price)}
                                </span>
                                {product.discount_price && (
                                    <div className="flex flex-col mb-1">
                                        <span className="text-zinc-400 dark:text-zinc-500 line-through text-lg font-price">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-green-600 dark:text-green-400 text-sm font-bold">
                                            {Math.round(((product.price - product.discount_price) / product.price) * 100)}% Savings
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 h-14">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-bold text-zinc-900 dark:text-white">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-12 h-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={addToCart}
                                        disabled={addingToCart}
                                        className={`flex-1 h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-95
                                        ${addingToCart
                                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/10 dark:shadow-white/5 hover:translate-y-[-2px]'
                                            }
                                    `}
                                    >
                                        {addingToCart ? (
                                            <>
                                                <Check size={20} /> Added
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag size={20} /> Add to Collection
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsMockupOpen(true)}
                                        className="flex-[1.2] py-4 px-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-600/10 dark:to-indigo-600/10 border border-blue-200 dark:border-blue-500/30 font-bold hover:border-blue-300 dark:hover:border-blue-500/60 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-300 text-blue-600 dark:text-white flex items-center justify-center gap-2 group text-sm md:text-base shadow-sm hover:shadow-md"
                                    >
                                        <div className="relative">
                                            <Maximize2 size={18} className="group-hover:scale-110 transition-transform text-blue-500 dark:text-blue-400" />
                                            <Sparkles size={8} className="absolute -top-1 -right-1 text-blue-400 dark:text-blue-300 animate-pulse" />
                                        </div>
                                        <span className="truncate bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-100 dark:to-white font-black uppercase tracking-tight">View In Room</span>
                                    </button>
                                    <WishlistButton
                                        productId={product.id}
                                        variant="button"
                                        showText
                                        size="md"
                                        className="flex-1 py-4 h-[57.5px]"
                                    />
                                </div>
                            </div>
                            <p className="text-center text-xs text-zinc-500 mt-4">
                                Free reliable shipping and 7-day returns included.
                            </p>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-xl font-heading font-semibold text-zinc-900 dark:text-white mb-4">Curator's Note</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
                                {product.description || 'This exquisite piece represents a profound exploration of modern aesthetics.'}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-4 mt-auto">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
                                <ShieldCheck size={24} className="text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Authentic</span>
                                    <span className="text-xs text-zinc-500">Verified Original</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
                                <Truck size={24} className="text-blue-500" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Global Shipping</span>
                                    <span className="text-xs text-zinc-500">Insured Delivery</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
                                <CreditCard size={24} className="text-purple-500" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Secure Pay</span>
                                    <span className="text-xs text-zinc-500">Encrypted</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-white/5">
                                <Clock size={24} className="text-amber-500" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">Returns</span>
                                    <span className="text-xs text-zinc-500">30-Day Policy</span>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </div>

            {/* Zoom Modal */}
            <AnimatePresence>
                {isZoomOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                        onClick={() => setIsZoomOpen(false)}
                    >
                        <button
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
                            onClick={() => setIsZoomOpen(false)}
                        >
                            <X size={24} />
                        </button>

                        <div
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
                                onClick={() => handleZoom('out')}
                                disabled={zoomScale <= 1}
                            >
                                -
                            </button>
                            <span className="font-mono font-bold text-white w-12 text-center">{Math.round(zoomScale * 100)}%</span>
                            <button
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-colors"
                                onClick={() => handleZoom('in')}
                                disabled={zoomScale >= 4}
                            >
                                +
                            </button>
                        </div>

                        <motion.div
                            className="relative w-full h-full flex items-center justify-center overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <motion.img
                                initial={{ scale: 0.8 }}
                                animate={{ scale: zoomScale }}
                                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                                src={product.images[activeImage]}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain cursor-grab active:cursor-grabbing"
                                drag
                                dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
                                dragElastic={0.1}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <VirtualMockup
                isOpen={isMockupOpen}
                onClose={() => setIsMockupOpen(false)}
                productImage={product.images[activeImage]}
                productName={product.name}
            />
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                productName={product.name}
                productUrl={typeof window !== 'undefined' ? window.location.href : ''}
            />
        </main>
    );
}
