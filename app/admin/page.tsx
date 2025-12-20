import { getAdminStats } from '@/app/actions/admin';
import { DollarSign, ShoppingBag, Users as UsersIcon, TrendingUp } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const data = await getAdminStats();

    const stats = [
        { label: 'Total Revenue', value: `$${data.totalRevenue.toLocaleString()}`, icon: DollarSign, change: 'Lifetime' },
        { label: 'Total Orders', value: data.totalOrders.toString(), icon: ShoppingBag, change: 'Lifetime' },
        { label: 'Active Artworks', value: data.activeArtworks.toString(), icon: UsersIcon, change: 'Live' },
        { label: 'Avg. Order Value', value: `$${data.avgOrderValue.toFixed(2)}`, icon: TrendingUp, change: 'Avg' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-medium">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, Admin. Real-time platform data.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="p-6 rounded-xl bg-zinc-900 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-zinc-900 border border-white/5 min-h-[300px]">
                    <h3 className="font-bold mb-4">Revenue Over Time</h3>
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm italic border border-dashed border-zinc-800 rounded-lg">
                        [Chart integration would go here]
                    </div>
                </div>
                <div className="p-6 rounded-xl bg-zinc-900 border border-white/5 min-h-[300px]">
                    <h3 className="font-bold mb-4">Recent Sales</h3>
                    <div className="space-y-4">
                        <div className="text-sm text-zinc-500 italic text-center py-10">
                            No orders recorded in the new system yet.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
