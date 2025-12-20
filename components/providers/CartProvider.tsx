"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    title: string;
    price: number;
    image_url: string;
    artist: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Load cart from local storage on mount
    useEffect(() => {
        setIsMounted(true);
        const savedCart = localStorage.getItem("artverse_cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save cart to local storage on change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem("artverse_cart", JSON.stringify(items));
        }
    }, [items, isMounted]);

    const addItem = (item: CartItem) => {
        setItems((prev) => {
            if (prev.find((i) => i.id === item.id)) return prev; // Prevent duplicates
            return [...prev, item];
        });
        setIsOpen(true); // Open cart when item added
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => setIsOpen((prev) => !prev);

    const cartCount = items.length;
    const cartTotal = items.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartCount, cartTotal, isOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
