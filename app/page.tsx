import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FeaturedArt } from "@/components/FeaturedArt";
import { getFeaturedArtworks } from "./actions/getArtworks";

export const dynamic = 'force-dynamic'; // Ensure real-time data

export default async function Home() {
  const artworks = await getFeaturedArtworks();

  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Dynamic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">
          {/* Background Image with Parallax-like feel */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop"
              alt="Abstract Art Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-gray-200 mb-4">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>The New Standard for Digital Art</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
              Discover Rare <br /> & Exquisite Art.
            </h1>

            <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-4">
              A curated marketplace for the world's most visionary artists and collectors.
              Experience art with Augmented Reality before you buy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md mx-auto px-4">
              <Link href="/explore" className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-black font-bold text-lg hover:bg-rose-500 hover:text-white transition-all shadow-lg hover:shadow-rose-500/25 flex items-center justify-center gap-2">
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/signup?role=seller" className="w-full sm:w-auto flex items-center justify-center h-14 px-8 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm text-white font-medium text-lg hover:bg-white/10 transition-all">
                Sell Artwork
              </Link>
            </div>
          </div>
        </section>

        {/* Categories / Ticker (Marquee style) */}
        <div className="w-full border-y border-white/10 bg-black/50 backdrop-blur-sm py-6 overflow-hidden">
          <div className="flex gap-12 items-center whitespace-nowrap animate-marquee">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-12 items-center">
                <span className="text-zinc-500 font-serif text-xl md:text-2xl uppercase tracking-widest">Oil Painting</span>
                <span className="text-zinc-700 font-serif text-xl md:text-2xl">•</span>
                <span className="text-zinc-500 font-serif text-xl md:text-2xl uppercase tracking-widest">Digital Art</span>
                <span className="text-zinc-700 font-serif text-xl md:text-2xl">•</span>
                <span className="text-zinc-500 font-serif text-xl md:text-2xl uppercase tracking-widest">Sculpture</span>
                <span className="text-zinc-700 font-serif text-xl md:text-2xl">•</span>
                <span className="text-zinc-500 font-serif text-xl md:text-2xl uppercase tracking-widest">Photography</span>
                <span className="text-zinc-700 font-serif text-xl md:text-2xl">•</span>
                <span className="text-zinc-500 font-serif text-xl md:text-2xl uppercase tracking-widest">Abstract</span>
                <span className="text-zinc-700 font-serif text-xl md:text-2xl">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <FeaturedArt artworks={artworks} />

      </main>
    </div>
  );
}
