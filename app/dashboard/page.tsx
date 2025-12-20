import { Navbar } from "@/components/Navbar";
import { getBuyerStats } from "@/app/actions/getBuyerStats";
import Link from "next/link";
import { Package, ShoppingBag } from "lucide-react";

export default async function BuyerDashboard() {
    const stats = await getBuyerStats();
    const orders = stats?.orders || [];

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-serif text-3xl font-bold">My Collection</h1>
                    <div className="text-right">
                        <p className="text-sm text-zinc-500">Total Invested</p>
                        <p className="text-xl font-bold text-rose-500">
                            ${stats?.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                        </p>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {orders.map((order) => (
                            <div key={order.id} className="p-6 bg-zinc-900 border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-full shrink-0">
                                        <Package className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
                                        <p className="text-sm text-zinc-500">
                                            {new Date(order.created_at).toLocaleDateString()} • <span className="text-rose-500">{order.status}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                    <p className="font-bold text-lg">${order.total_amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        <div className="p-12 bg-zinc-900 border border-white/5 rounded-xl flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="w-12 h-12 text-zinc-600 mb-4" />
                            <h3 className="text-lg font-bold mb-2">Your collection is empty</h3>
                            <p className="text-zinc-500 mb-6 max-w-sm">
                                Start exploring unique artworks from independent artists around the world.
                            </p>
                            <Link href="/explore" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all">
                                Start Exploring
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
