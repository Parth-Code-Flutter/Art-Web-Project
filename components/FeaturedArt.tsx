import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Artwork } from "@/app/actions/getArtworks";

interface FeaturedArtProps {
    artworks: Artwork[];
}

/**
 * FeaturedArt Component
 * 
 * Displays a grid of "Trending" or "Featured" artworks.
 * Uses a Masonry-like grid layout (responsive).
 */
export function FeaturedArt({ artworks }: FeaturedArtProps) {
    // Fallback if no artworks (e.g. before seeding)
    if (!artworks || artworks.length === 0) {
        return (
            <section className="py-24 px-6 bg-zinc-950">
                <div className="container max-w-7xl mx-auto text-center">
                    <h2 className="font-serif text-3xl text-zinc-500">No artworks found.</h2>
                    <p className="text-zinc-600 mt-2">Run the seed script in Supabase to see content here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 bg-zinc-950">
            <div className="container max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="space-y-4">
                        <h2 className="font-serif text-4xl md:text-5xl text-white">Trending Now</h2>
                        <p className="text-zinc-400 max-w-md">
                            Curated selections from the world's most promising emerging artists.
                            Verified authenticated and ready for your collection.
                        </p>
                    </div>
                    {/* View All Link */}
                    <Link href="/explore" className="group flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:border-rose-500 transition-all">
                        View All Artworks
                        <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Artwork Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {artworks.map((art) => (
                        <div key={art.id} className="group relative aspect-[3/4] overflow-hidden rounded-none bg-zinc-900 cursor-pointer">
                            {/* Artwork Image */}
                            <Image
                                src={art.image_url}
                                alt={art.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Tag (Top Left) */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-xs font-medium text-white border border-white/20">
                                    {art.category}
                                </span>
                            </div>

                            {/* Info Block (Bottom) */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-serif text-xl text-white mb-1">{art.title}</h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-300">{art.profiles?.username || 'Unknown Artist'}</span>
                                    <span className="font-mono font-medium text-rose-400">${art.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
