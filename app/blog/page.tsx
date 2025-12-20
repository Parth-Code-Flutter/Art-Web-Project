import { Navbar } from "@/components/Navbar";

/**
 * Journal (Blog) Page
 * 
 * Articles about art trends, artist interviews, and platform updates.
 */
export default function BlogPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />
            <main className="pt-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">The Journal</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Stories from the ArtVerse.
                    </p>
                </div>

                <div className="grid gap-12 max-w-3xl">
                    {[1, 2, 3].map((i) => (
                        <article key={i} className="border-b border-white/10 pb-12">
                            <p className="text-rose-500 text-sm font-mono mb-2">Dec 20, 2025</p>
                            <h2 className="text-3xl font-serif mb-4 hover:text-zinc-300 cursor-pointer">The Rise of Digital Sculpture in 2026</h2>
                            <p className="text-zinc-400 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
                            </p>
                            <div className="mt-4 text-sm font-medium underline underline-offset-4 cursor-pointer">Read more</div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
