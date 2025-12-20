import { Navbar } from "@/components/Navbar";
import { Link } from "lucide-react";

export default function BuyerDashboard() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-6 py-24">
                <h1 className="font-serif text-3xl font-bold mb-6">My Collection</h1>

                <div className="grid grid-cols-1 gap-8">
                    <div className="p-6 bg-zinc-900 border border-white/5 rounded-xl min-h-[200px] flex items-center justify-center text-zinc-500 italic">
                        No orders yet. Start exploring to build your collection.
                    </div>
                </div>
            </div>
        </div>
    );
}
