import { Navbar } from "@/components/Navbar";
import { getSellerStats } from "@/app/actions/getSellerStats";

export default async function SellerDashboard() {
    const stats = await getSellerStats();

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="font-serif text-3xl font-bold">Seller Dashboard</h1>
                    <span className="text-zinc-500 text-sm">Welcome back, Artist</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                <div className="mt-12 p-8 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-500">
                    <p>Manage your inventory and orders here.</p>
                </div>
            </div>
        </div>
    );
}
