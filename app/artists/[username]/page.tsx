import { Navbar } from "@/components/Navbar";
import { getArtistByUsername } from "@/app/actions/profiles";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, Instagram, Twitter } from "lucide-react";

export default async function ArtistProfilePage({ params }: { params: { username: string } }) {
    const data = await getArtistByUsername(params.username);

    if (!data) {
        notFound();
    }

    const { profile, artworks } = data;

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />

            {/* Header / Hero */}
            <div className="relative pt-20">
                <div className="h-[30vh] bg-gradient-to-b from-rose-900/20 to-zinc-950 border-b border-white/5"></div>

                <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row gap-8 items-end">
                        <div className="w-40 h-40 rounded-2xl bg-zinc-800 border-4 border-zinc-950 overflow-hidden relative shadow-2xl">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt={profile.username} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold bg-rose-500/20 text-rose-500">
                                    {profile.username[0].toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-2 pb-2">
                            <h1 className="text-4xl md:text-5xl font-serif font-bold">{profile.full_name || profile.username}</h1>
                            <p className="text-zinc-400">@{profile.username}</p>

                            <div className="flex gap-4 pt-4">
                                <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Instagram className="w-4 h-4 text-zinc-400" />
                                </Link>
                                <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Twitter className="w-4 h-4 text-zinc-400" />
                                </Link>
                                <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                    <Globe className="w-4 h-4 text-zinc-400" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* Sidebar: Bio */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">About the Artist</h3>
                        <p className="text-zinc-400 leading-relaxed font-light italic">
                            {profile.bio || "This artist hasn't shared their story yet, but their work speaks for itself."}
                        </p>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                        <div className="flex justify-between py-2">
                            <span className="text-zinc-500 text-sm italic">Total Artworks</span>
                            <span className="font-mono text-sm">{artworks.length}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-zinc-500 text-sm italic">Member Since</span>
                            <span className="font-mono text-sm">{new Date(profile.created_at).getFullYear()}</span>
                        </div>
                    </div>
                </div>

                {/* Grid: Artworks */}
                <div className="lg:col-span-3 space-y-12">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                        <h2 className="text-2xl font-serif">Original Works</h2>
                        <span className="text-xs text-zinc-500">{artworks.length} items</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {artworks.map((art) => (
                            <Link href={`/artwork/${art.id}`} key={art.id} className="group space-y-4">
                                <div className="aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden relative border border-white/5">
                                    <Image
                                        src={art.image_url}
                                        alt={art.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-4 py-2 bg-white text-black rounded-full text-xs font-bold">View Piece</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium group-hover:text-rose-500 transition-colors uppercase tracking-tight">{art.title}</h3>
                                    <p className="font-mono text-sm text-zinc-500">${art.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {artworks.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                            <p className="text-zinc-500 italic">No works public yet. Stay tuned!</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
