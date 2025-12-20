import { Navbar } from "@/components/Navbar";

/**
 * Artists Page
 * 
 * Lists featured artists and allows searching for specific creators.
 */
export default function ArtistsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />
            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Our Artists</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Meet the visionaries behind the art. From emerging digital talents to established traditional painters.
                    </p>
                </div>

                {/* Placeholder List */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-zinc-900 border border-white/5 rounded-lg flex items-center px-8 gap-6">
                            <div className="w-16 h-16 rounded-full bg-zinc-800" />
                            <div>
                                <h3 className="text-xl font-bold">Artist Name {i}</h3>
                                <p className="text-zinc-500 text-sm">Digital • 3D • Abstract</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
