import { Navbar } from "@/components/Navbar";
import { getArtworkById } from "@/app/actions/getArtworks";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ArrowLeft, Share2, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface ArtworkPageProps {
    params: {
        id: string;
    }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
    const artwork = await getArtworkById(params.id);

    if (!artwork) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />

            <main className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Back Nav */}
                    <Link href="/explore" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Collection
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Left: Image Showcase */}
                        <div className="space-y-6">
                            <div className="relative aspect-[4/5] w-full bg-zinc-900 rounded-lg overflow-hidden border border-white/5">
                                <Image
                                    src={artwork.image_url}
                                    alt={artwork.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {artwork.category && (
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300">
                                        {artwork.category}
                                    </span>
                                )}
                                {/* Mock tags if not present in DB yet, or real tags if you add them to the type */}
                            </div>
                        </div>

                        {/* Right: Details & Purchase */}
                        <div className="flex flex-col h-full pt-4">
                            <div className="flex-1 space-y-8">

                                {/* Header */}
                                <div className="space-y-4 border-b border-white/10 pb-8">
                                    <h1 className="font-serif text-4xl md:text-6xl leading-tight">{artwork.title}</h1>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 overflow-hidden relative">
                                            {artwork.profiles?.avatar_url ? (
                                                <Image src={artwork.profiles.avatar_url} alt="artist" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-rose-500/20 flex items-center justify-center text-xs font-bold text-rose-500">
                                                    {artwork.profiles?.username?.[0] || 'A'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-zinc-400">Created by</span>
                                            <span className="font-medium text-white">{artwork.profiles?.username || 'Unknown Artist'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">About the Artwork</h3>
                                    <p className="text-lg text-zinc-300 leading-relaxed font-light">
                                        {artwork.description || "No description provided by the artist."}
                                    </p>
                                </div>

                                {/* Dimensions if available */}
                                {/* You can add this if you modify the Artwork interface to include width/height */}
                            </div>

                            {/* Purchase Action */}
                            <div className="mt-8 bg-zinc-900/50 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <p className="text-sm text-zinc-400 mb-1">Current Price</p>
                                        <div className="text-3xl font-serif text-white">${artwork.price?.toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-rose-500">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 hover:text-rose-500">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <AddToCartButton
                                    artwork={{
                                        id: artwork.id,
                                        title: artwork.title,
                                        price: artwork.price,
                                        image_url: artwork.image_url,
                                        artist: artwork.profiles?.username || 'Unknown Artist'
                                    }}
                                />
                                <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Verified Authentic • Secure Transaction
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
