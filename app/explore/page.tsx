import { Navbar } from "@/components/Navbar";

/**
 * Explore Page
 * 
 * Displays a grid of all artworks with filtering options.
 * Currently a placeholder structure.
 */
export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />
            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Explore Collection</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Browse our complete catalog of verified digital and physical artworks from creators worldwide.
                    </p>
                </div>

                {/* Placeholder Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-zinc-900 border border-white/5 rounded-lg flex items-center justify-center">
                            <span className="text-zinc-600 font-mono">Artwork {i} Placeholder</span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
