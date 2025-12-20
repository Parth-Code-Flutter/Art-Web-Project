import { Navbar } from "@/components/Navbar";

/**
 * Collections Page
 * 
 * Grouped sets of artworks (e.g., "Cyberpunk 2077", "Abstract Nature").
 */
export default function CollectionsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />
            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Curated Collections</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Thematic series and exclusive drops hand-picked by our curators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="aspect-video bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <h3 className="relative z-10 text-2xl font-serif">Collection {i}</h3>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
