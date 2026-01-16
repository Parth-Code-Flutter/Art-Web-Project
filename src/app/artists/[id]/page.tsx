'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Palette,
    ArrowLeft,
    ExternalLink,
    ShoppingBag,
    Instagram,
    Twitter,
    Globe,
    Zap,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface ArtistProfile {
    id: string;
    full_name: string;
    bio: string;
    portfolio_url: string;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: string;
}

export default function ArtistProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [artist, setArtist] = useState<ArtistProfile | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (id) {
            fetchArtistData();
        }
    }, [id]);

    const fetchArtistData = async () => {
        setLoading(true);
        try {
            // Fetch artist profile
            const { data: profile, error: profileError } = await supabase
                .from('sellers')
                .select('*')
                .eq('id', id)
                .single();

            if (profileError || !profile) throw new Error('Artist not found');
            setArtist(profile);

            // Fetch artist masterpieces
            const { data: pieces, error: piecesError } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', id)
                .order('created_at', { ascending: false });

            if (!piecesError) {
                setProducts(pieces || []);
            }
        } catch (err) {
            console.error('Error fetching artist data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (!artist) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <p className="text-zinc-500 mb-4 italic">"This creator has vanished from the grid."</p>
                <button onClick={() => router.back()} className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <ArrowLeft size={16} /> Return to Gallery
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/5 blur-[150px] rounded-full -ml-96 -mb-96 pointer-events-none" />

            {/* Header / Navigation */}
            <nav className="p-8 flex items-center justify-between relative z-10">
                <button onClick={() => router.back()} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Zap size={12} /> Verified Creator
                </div>
            </nav>

            {/* Profile Intro */}
            <section className="px-8 pt-12 pb-24 max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end">
                    <div className="space-y-8">
                        <div>
                            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs mb-4">Master Artist</p>
                            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9]">
                                {artist.full_name}
                            </h1>
                        </div>

                        <p className="text-lg text-zinc-400 leading-relaxed max-w-xl italic">
                            "{artist.bio}"
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {artist.portfolio_url && (
                                <a
                                    href={artist.portfolio_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all"
                                >
                                    View Repository <ExternalLink size={14} />
                                </a>
                            )}
                            <div className="flex gap-2">
                                <button className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"><Instagram size={18} /></button>
                                <button className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"><Twitter size={18} /></button>
                                <button className="p-3 rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all"><Globe size={18} /></button>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:block">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Manifestations</p>
                                <p className="text-4xl font-black text-white">{products.length.toString().padStart(2, '0')}</p>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl">
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Residency Since</p>
                                <p className="text-2xl font-black text-white">{new Date(artist.created_at).getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Masterpieces Grid */}
            <section className="px-8 pb-32 max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                        <ShoppingBag size={24} className="text-blue-500" /> Current Works
                    </h2>
                    <div className="h-px flex-1 bg-white/5 mx-8 hidden md:block" />
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Displaying {products.length} fragments</p>
                </div>

                {products.length === 0 ? (
                    <div className="p-20 text-center rounded-[3rem] bg-zinc-900/20 border border-dashed border-white/10">
                        <p className="text-zinc-500 font-medium italic">"No active transmissions at this coordinate."</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((piece, i) => (
                            <motion.div
                                key={piece.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => router.push(`/product/${piece.id}`)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 relative mb-6 shadow-2xl">
                                    <img
                                        src={piece.images?.[0] || '/placeholder-art.jpg'}
                                        alt={piece.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{piece.category}</p>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">{piece.name}</h3>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{piece.category}</span>
                                    <span className="text-xl font-black text-white">₹{piece.price.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
