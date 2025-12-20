import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { FeaturedArt } from "@/components/FeaturedArt";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Dynamic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">

          {/* Abstract Art Background Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop"
              alt="Abstract Art Background"
              fill
              className="object-cover opacity-60 animate-in fade-in duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 mt-16 animate-in slide-in-from-bottom-8 duration-700 fade-in fill-mode-backwards">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-gray-200">The Future of Digital Collecting</span>
            </div>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              Identify. <br />
              Visualize. <br />
              <span className="italic text-rose-500">Collect.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              A curated marketplace for unique artworks. Use our <span className="text-white font-medium">Augmented Reality</span> tools to preview art in your space before you buy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="h-14 px-8 w-full sm:w-auto rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition-all hover:scale-105 flex items-center justify-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-14 px-8 w-full sm:w-auto rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white font-medium">
                View in Room Demo
              </button>
            </div>
          </div>
        </section>

        {/* Categories / Ticker */}
        <div className="w-full border-y border-white/10 bg-black/50 backdrop-blur-sm py-6 overflow-hidden">
          <div className="flex gap-12 animate-scroll whitespace-nowrap min-w-full justify-center text-sm font-medium tracking-widest text-gray-500 uppercase">
            <span>Oil Painting</span>
            <span>•</span>
            <span>Digital Sculptures</span>
            <span>•</span>
            <span>Abstract 3D</span>
            <span>•</span>
            <span>Photography</span>
            <span>•</span>
            <span>Generative Art</span>
            <span>•</span>
            <span>Street Art</span>
            <span>•</span>
            <span>NFTs</span>
            <span>•</span>
            <span>Fine Art Prints</span>
          </div>
        </div>

        {/* Featured Section */}
        <FeaturedArt />

      </main>
    </div>
  );
}
