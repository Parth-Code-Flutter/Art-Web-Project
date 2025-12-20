import { Navbar } from "@/components/Navbar";
import { getAllArtworks } from "@/app/actions/getArtworks";
import { Search, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ExplorePageProps {
    searchParams: {
        query?: string;
        category?: string;
    }
}

// Enable dynamic rendering for search params
export const dynamic = 'force-dynamic';

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
    const query = searchParams.query || "";
    const category = searchParams.category || "All";

    const artworks = await getAllArtworks(query, category);

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />
            <main className="pt-24 px-6 max-w-7xl mx-auto pb-20">

                {/* Header & Search Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <h1 className="font-serif text-4xl md:text-5xl">Explore Collection</h1>
                        <p className="text-zinc-400 max-w-xl">
                            Discover unique digital and physical masterpieces from verified creators.
                        </p>
                    </div>

                    {/* Search Form */}
                    <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-rose-500 transition-colors" />
                            <input
                                type="text"
                                name="query"
                                placeholder="Search by title..."
                                defaultValue={query}
                                className="pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-rose-500 transition-all w-full sm:w-64"
                            />
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative group">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-rose-500 transition-colors" />
                            <select
                                name="category"
                                defaultValue={category}
                                className="pl-10 pr-8 py-2.5 bg-zinc-900 border border-white/10 rounded-lg outline-none focus:border-rose-500 transition-all appearance-none cursor-pointer hover:bg-zinc-800"
                            >
                                <option value="All">All Categories</option>
                                <option value="Oil">Oil Painting</option>
                                <option value="Digital">Digital Art</option>
                                <option value="Abstract">Abstract</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Photography">Photography</option>
                            </select>
                        </div>

                        <button type="submit" className="px-6 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-rose-500 hover:text-white transition-colors">
                            Search
                        </button>
                    </form>
                </div>

                {/* Results Grid */}
                {artworks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {artworks.map((art) => (
                            <Link href={`/artwork/${art.id}`} key={art.id} className="group block space-y-3">
                                <div className="aspect-[3/4] overflow-hidden rounded-md bg-zinc-900 relative">
                                    <Image
                                        src={art.image_url}
                                        alt={art.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/20">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-serif text-lg leading-tight group-hover:text-rose-500 transition-colors">{art.title}</h3>
                                        <span className="font-mono text-sm text-rose-400 font-medium">${art.price}</span>
                                    </div>
                                    <p className="text-sm text-zinc-500 mt-1">{art.profiles?.username || 'Unknown Artist'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-xl">
                        <p className="text-zinc-500 text-lg">No artworks found matching your criteria.</p>
                        <Link href="/explore" className="text-rose-500 hover:underline mt-2 inline-block">Clear all filters</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
