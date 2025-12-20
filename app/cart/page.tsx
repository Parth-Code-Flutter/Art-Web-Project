"use client";

import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/providers/CartProvider";
import { Trash2, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
    const { items, removeItem, cartTotal, clearCart } = useCart();

    const handleCheckout = () => {
        alert("Stripe Checkout Integration coming next!");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 flex flex-col">
            <Navbar />

            <main className="flex-1 pt-24 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-serif text-4xl mb-8">Your Collection</h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
                            <p className="text-zinc-500 mb-4">Your cart is empty.</p>
                            <Link href="/explore" className="text-rose-500 hover:underline">
                                Start Exploring Art
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Cart Items List */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl items-center">
                                        <div className="relative w-24 h-24 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif text-lg truncate">{item.title}</h3>
                                            <p className="text-sm text-zinc-400">{item.artist}</p>
                                            <p className="text-rose-500 font-bold mt-1">${item.price.toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Summary / Checkout */}
                            <div className="space-y-6">
                                <div className="bg-zinc-900 p-6 rounded-2xl border border-white/10 sticky top-24">
                                    <h3 className="text-lg font-bold mb-4">Summary</h3>

                                    <div className="flex justify-between mb-2 text-zinc-400">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-6 text-zinc-400">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>

                                    <div className="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
                                        <span className="font-bold text-xl">Total</span>
                                        <span className="font-bold text-xl">${cartTotal.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full py-3 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 mb-4"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
                                        <Lock className="w-3 h-3" />
                                        Secure Encrypted Checkout
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
