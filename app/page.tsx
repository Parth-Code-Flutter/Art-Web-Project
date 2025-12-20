
import { ArrowRight, Sparkles, Search, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="container flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tighter">ArtVerse.</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/explore" className="text-sm font-medium hover:text-rose-400 transition-colors">Explore</Link>
            <Link href="/artists" className="text-sm font-medium hover:text-rose-400 transition-colors">Artists</Link>
            <Link href="/collections" className="text-sm font-medium hover:text-rose-400 transition-colors">Collections</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/login" className="hidden md:block text-sm font-medium hover:text-rose-400 transition-colors">
              Sign In
            </Link>
            <button className="hidden md:flex h-10 px-6 items-center justify-center rounded-full bg-white text-black text-sm font-bold hover:bg-rose-500 hover:text-white transition-all">
              Start Selling
            </button>
            <button className="md:hidden p-2 text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* Dynamic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6">

          {/* Abstract Art Background Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop"
              alt="Abstract Art Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8 mt-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-fade-in-up">
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

      </main>
    </div>
  );
}
