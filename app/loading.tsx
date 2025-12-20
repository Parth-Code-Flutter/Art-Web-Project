export default function Loading() {
    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-t-2 border-rose-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-t-2 border-white/20 rounded-full animate-spin reverse"></div>
            </div>
            <p className="text-zinc-500 font-serif animate-pulse">Curating ArtVerse...</p>
        </div>
    );
}
