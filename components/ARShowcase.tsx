"use client";

import { useState, useRef } from "react";
import { Camera, Maximize, Move, Upload, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ARShowcaseProps {
    artworkUrl: string;
    title: string;
}

export function ARShowcase({ artworkUrl, title }: ARShowcaseProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [wallImage, setWallImage] = useState<string | null>(null);
    const [artSize, setArtSize] = useState(40); // Percentage of container
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const wallRef = useRef<HTMLDivElement>(null);

    const handleWallUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setWallImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full py-4 mt-4 border border-rose-500/30 text-rose-500 font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                View in My Room (AR)
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-[110]"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>

                        <div className="max-w-6xl w-full h-full flex flex-col">

                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-serif font-bold text-white mb-2">AR Preview: {title}</h2>
                                <p className="text-zinc-400 text-sm">Upload a photo of your wall to see how this piece fits your space.</p>
                            </div>

                            {/* Main Stage */}
                            <div
                                ref={wallRef}
                                className="flex-1 bg-zinc-900 rounded-3xl relative overflow-hidden flex items-center justify-center border border-white/5 shadow-2xl"
                            >
                                {wallImage ? (
                                    <>
                                        {/* Wall Background */}
                                        <img src={wallImage} alt="Your Wall" className="w-full h-full object-cover" />

                                        {/* Draggable Artwork */}
                                        <motion.div
                                            drag
                                            dragConstraints={wallRef}
                                            style={{ width: `${artSize}%` }}
                                            className="absolute cursor-move group"
                                        >
                                            <img
                                                src={artworkUrl}
                                                alt={title}
                                                className="w-full shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-[10px] border-white/5 rounded-sm"
                                            />
                                            {/* Scale Control Overlay */}
                                            <div className="absolute inset-0 border-2 border-rose-500 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none transition-opacity">
                                                <div className="bg-rose-500 text-white p-2 rounded-full">
                                                    <Move className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                ) : (
                                    <div className="text-center p-12 max-w-sm">
                                        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Upload className="w-10 h-10 text-rose-500" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Upload Wall Photo</h3>
                                        <p className="text-zinc-500 text-sm mb-8 italic">Choose a well-lit photo of your empty wall for the best results.</p>

                                        <label className="px-8 py-3 bg-white text-black font-bold rounded-full cursor-pointer hover:bg-rose-500 hover:text-white transition-all">
                                            Select Photo
                                            <input type="file" accept="image/*" className="hidden" onChange={handleWallUpload} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Controls Footer */}
                            {wallImage && (
                                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className="flex-1 md:flex-none">
                                            <label className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2 font-bold">Scaling</label>
                                            <input
                                                type="range"
                                                min="10"
                                                max="90"
                                                value={artSize}
                                                onChange={(e) => setArtSize(Number(e.target.value))}
                                                className="w-full md:w-48 accent-rose-500"
                                            />
                                        </div>

                                        <button
                                            onClick={() => setWallImage(null)}
                                            className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                                        >
                                            Change Wall
                                        </button>
                                    </div>

                                    <div className="text-xs text-zinc-500 italic max-w-xs text-center md:text-right">
                                        Tip: Drag the artwork to position it. Use the slider to match real-world scale.
                                    </div>
                                </div>
                            )}

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
