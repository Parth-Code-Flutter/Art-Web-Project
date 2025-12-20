import { Navbar } from "@/components/Navbar";
import { getSellerStats } from "@/app/actions/getSellerStats";
import { getSellerArtworks, getSellerOrders } from "@/app/actions/inventory";
import { Package, Trash2, ExternalLink, ShoppingBag, Mail, User } from "lucide-react";
import Link from "next/link";
import { DeleteArtworkButton } from "@/components/DeleteArtworkButton";

export default async function SellerDashboard() {
    const stats = await getSellerStats();
    const artworks = await getSellerArtworks();
    const orders = await getSellerOrders();

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 pb-20">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-serif text-3xl font-bold">Seller Dashboard</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage your studio and sales</p>
                    </div>
                    <Link href="/sell" className="px-6 py-2 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-all text-sm">
                        + New Listing
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="p-6 bg-zinc-900 border border-white/5 rounded-xl">
                        <h3 className="text-zinc-400 text-sm mb-2">Total Earnings</h3>
                        <p className="text-2xl font-bold text-rose-500">
                            ${stats?.earnings.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? "0.00"}
                        </p>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-white/5 rounded-xl">
                        <h3 className="text-zinc-400 text-sm mb-2">Active Listings</h3>
                        <p className="text-2xl font-bold">{stats?.activeListings ?? 0}</p>
                    </div>
                    <div className="p-6 bg-zinc-900 border border-white/5 rounded-xl">
                        <h3 className="text-zinc-400 text-sm mb-2">Total Sales</h3>
                        <p className="text-2xl font-bold">{stats?.ordersToShip ?? 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Inventory Table (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Package className="w-5 h-5 text-rose-500" /> Your Inventory
                        </h2>

                        {artworks.length > 0 ? (
                            <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-black/50 text-zinc-500 text-xs uppercase tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Artwork</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                            <th className="px-6 py-4 font-medium">Price</th>
                                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {artworks.map((art) => (
                                            <tr key={art.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded bg-zinc-800 overflow-hidden relative">
                                                            <img src={art.image_url} alt="" className="object-cover w-full h-full" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-white">{art.title}</div>
                                                            <div className="text-xs text-zinc-500">{art.category}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${art.status === 'available' ? 'bg-green-500/10 text-green-500' : 'bg-rose-500/10 text-rose-500'
                                                        }`}>
                                                        {art.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    ${art.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/artwork/${art.id}`} target="_blank" className="p-2 text-zinc-500 hover:text-white transition-colors">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </Link>
                                                        <DeleteArtworkButton id={art.id} imageUrl={art.image_url} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500">
                                No artworks listed yet. Click "+ New Listing" to start.
                            </div>
                        )}
                    </div>

                    {/* Recent Orders (1/3 width) */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-rose-500" /> Recent Sales
                        </h2>

                        <div className="space-y-4">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order.id} className="p-4 bg-zinc-900 border border-white/5 rounded-xl space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-zinc-500 font-mono">ORDER #{order.id.slice(0, 8)}</p>
                                                <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded uppercase">
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-zinc-800 overflow-hidden">
                                                        <img src={item.image_url} alt="" className="object-cover w-full h-full" />
                                                    </div>
                                                    <p className="text-xs truncate flex-1">{item.title}</p>
                                                    <p className="text-xs font-bold">${item.price}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-white/5 space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                <User className="w-3 h-3" />
                                                <span>{order.buyer?.username || 'Guest'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                <Mail className="w-3 h-3" />
                                                <span>{order.buyer?.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center text-zinc-500 text-sm italic">
                                    No sales yet. Good things take time!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
