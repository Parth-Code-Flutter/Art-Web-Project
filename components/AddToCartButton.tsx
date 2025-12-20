"use client";

import { useCart, CartItem } from "@/components/providers/CartProvider";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({ artwork }: { artwork: CartItem }) {
    const { addItem, items } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Check if item is already in cart to maybe disable button or show "Added"
    const isInCart = items.some((item) => item.id === artwork.id);

    const handleAddToCart = () => {
        addItem(artwork);
        setIsAdded(true);
        // Reset "Added" state after 2 seconds for feedback
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (isInCart) {
        return (
            <button disabled className="w-full py-4 bg-zinc-800 text-zinc-400 font-bold text-lg rounded-full cursor-not-allowed flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                In Collection
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={`w-full py-4 font-bold text-lg rounded-full transition-all hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${isAdded
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-white text-black hover:bg-rose-500 hover:text-white"
                }`}
        >
            {isAdded ? (
                <>
                    <Check className="w-5 h-5" />
                    Added to Collection
                </>
            ) : (
                <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Collection
                </>
            )}
        </button>
    );
}
