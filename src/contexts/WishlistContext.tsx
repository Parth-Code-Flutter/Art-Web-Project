'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/providers/ToastProvider';

interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    category: string;
    images: string[];
}

interface WishlistContextType {
    wishlistItems: string[]; // Array of product IDs
    wishlistProducts: Product[]; // Full product details
    isInWishlist: (productId: string) => boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
    wishlistCount: number;
    loading: boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch wishlist on mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setWishlistItems([]);
                setWishlistProducts([]);
                setLoading(false);
                return;
            }

            // Fetch wishlist items
            const { data: wishlistData, error: wishlistError } = await supabase
                .from('wishlists')
                .select('product_id')
                .eq('user_id', user.id);

            if (wishlistError) throw wishlistError;

            const productIds = wishlistData?.map(item => item.product_id) || [];
            setWishlistItems(productIds);

            // Fetch full product details if we have items
            if (productIds.length > 0) {
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('id, name, price, discount_price, category, images')
                    .in('id', productIds)
                    .eq('status', 'approved');

                if (productsError) throw productsError;
                setWishlistProducts(productsData || []);
            } else {
                setWishlistProducts([]);
            }

        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const isInWishlist = (productId: string): boolean => {
        return wishlistItems.includes(productId);
    };

    const addToWishlist = async (productId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                showToast('Please login to save items to wishlist', 'error');
                return;
            }

            // Optimistic update
            setWishlistItems(prev => [...prev, productId]);

            // Add to database
            const { error } = await supabase
                .from('wishlists')
                .insert({
                    user_id: user.id,
                    product_id: productId
                });

            if (error) {
                // Revert on error
                setWishlistItems(prev => prev.filter(id => id !== productId));

                if (error.code === '23505') {
                    showToast('Already in wishlist', 'info');
                } else {
                    throw error;
                }
                return;
            }

            // Fetch the product details
            const { data: productData } = await supabase
                .from('products')
                .select('id, name, price, discount_price, category, images')
                .eq('id', productId)
                .single();

            if (productData) {
                setWishlistProducts(prev => [...prev, productData]);
            }

            showToast('Added to wishlist!', 'success');

        } catch (error) {
            console.error('Error adding to wishlist:', error);
            showToast('Failed to add to wishlist', 'error');
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return;

            // Optimistic update
            setWishlistItems(prev => prev.filter(id => id !== productId));
            setWishlistProducts(prev => prev.filter(p => p.id !== productId));

            // Remove from database
            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);

            if (error) {
                // Revert on error
                setWishlistItems(prev => [...prev, productId]);
                throw error;
            }

            showToast('Removed from wishlist', 'info');

        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showToast('Failed to remove from wishlist', 'error');
            // Refresh to get correct state
            await fetchWishlist();
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
        } else {
            await addToWishlist(productId);
        }
    };

    const refreshWishlist = async () => {
        await fetchWishlist();
    };

    const value: WishlistContextType = {
        wishlistItems,
        wishlistProducts,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
        loading,
        refreshWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
