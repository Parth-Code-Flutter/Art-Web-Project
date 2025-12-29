'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    Upload,
    Monitor,
    Camera,
    Move,
    Scaling,
    RotateCcw,
    Sparkles
} from 'lucide-react';

interface VirtualMockupProps {
    isOpen: boolean;
    onClose: () => void;
    productImage: string;
    productName: string;
}

const ROOMPRESETS = [
    {
        id: 'living-room',
        name: 'Grand Lounge',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600',
        initialScale: 0.25,
        initialX: 0,
        initialY: -50
    },
    {
        id: 'bedroom',
        name: 'Master Suite',
        url: 'https://images.unsplash.com/photo-1616594831818-8356037749b2?auto=format&fit=crop&q=80&w=1600',
        initialScale: 0.2,
        initialX: 0,
        initialY: -80
    },
    {
        id: 'office',
        name: 'Executive Office',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600',
        initialScale: 0.18,
        initialX: 0,
        initialY: -40
    }
];

export default function VirtualMockup({ isOpen, onClose, productImage, productName }: VirtualMockupProps) {
    const [activeRoom, setActiveRoom] = useState(ROOMPRESETS[0]);
    const [scale, setScale] = useState(activeRoom.initialScale);
    const [rotation, setRotation] = useState(0);
    const [isCustomMode, setIsCustomMode] = useState(false);
    const [customWall, setCustomWall] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset when room changes
    useEffect(() => {
        if (!isCustomMode) {
            setScale(activeRoom.initialScale);
        }
    }, [activeRoom, isCustomMode]);

    const handleWallUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setCustomWall(url);
            setIsCustomMode(true);
            setScale(0.3); // Default for custom wall
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-black/95 backdrop-blur-2xl flex flex-col md:flex-row h-screen overflow-hidden"
            >
                {/* Header - Mobile */}
                <div className="md:hidden p-4 flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <Sparkles className="text-blue-500" size={20} />
                        <h2 className="font-bold text-white tracking-tight uppercase text-sm">Virtual Mockup</h2>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Visualizer Area */}
                <div className="flex-1 relative bg-zinc-950 overflow-hidden group">
                    {/* Background Wall */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center p-4 md:p-12 mb-20 md:mb-0"
                        key={isCustomMode ? 'custom' : activeRoom.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                            <img
                                src={isCustomMode && customWall ? customWall : activeRoom.url}
                                alt="Background"
                                className="w-full h-full object-cover"
                            />

                            {/* Guide Overlay (Optional) */}
                            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                            {/* The Artwork */}
                            <motion.div
                                drag
                                dragMomentum={false}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{
                                    scale: scale,
                                    opacity: 1,
                                    rotate: rotation
                                }}
                                className="absolute cursor-move group/art"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    translateX: '-50%',
                                    translateY: '-50%',
                                }}
                            >
                                <div className="relative group/frame">
                                    {/* Glass reflection effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none z-10" />

                                    {/* Shadow for realism */}
                                    <img
                                        src={productImage}
                                        className="shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-[12px] border-zinc-900 ring-1 ring-white/10"
                                        alt={productName}
                                    />

                                    {/* Controls on hover (Desktop) */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/80 backdrop-blur-xl px-3 py-2 rounded-full border border-white/20 opacity-0 group-hover/art:opacity-100 transition-opacity whitespace-nowrap z-20">
                                        <Move size={14} className="text-zinc-500" />
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Interactive Fragment</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Quick Exit (Desktop Only) */}
                    <button
                        onClick={onClose}
                        className="hidden md:flex absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white backdrop-blur-xl border border-white/10 transition-all z-50 group shadow-2xl"
                    >
                        <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Bottom Info Bar - Floating */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-black/60 backdrop-blur-2xl rounded-[2rem] border border-white/10 z-40 hidden md:flex">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Active Piece</span>
                            <span className="text-sm font-bold text-white uppercase tracking-tight">{productName}</span>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Sparkles className="text-blue-500" size={16} />
                            <span className="text-sm font-medium text-zinc-300">AR Light Environment v1.0</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <aside className="w-full md:w-[400px] border-l border-white/10 bg-black/60 backdrop-blur-3xl flex flex-col p-6 md:p-10 shrink-0 z-50 overflow-y-auto max-h-[40vh] md:max-h-full">
                    <div className="hidden md:flex items-center gap-3 mb-10">
                        <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                            <Monitor size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">Quantum View</h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Spatial Simulation</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* Simulation Strategy */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Camera size={14} /> Simulation Strategy
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setIsCustomMode(false)}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase transition-all duration-300 ${!isCustomMode ? 'bg-white text-black shadow-lg shadow-white/5' : 'bg-white/5 text-zinc-500 hover:text-white border border-white/5'}`}
                                >
                                    Presets
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-xs uppercase transition-all duration-300 ${isCustomMode ? 'bg-white text-black shadow-lg shadow-white/5' : 'bg-white/5 text-zinc-500 hover:text-white border border-white/5'}`}
                                >
                                    My Space
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleWallUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Environment Selection (only if presets) */}
                        {!isCustomMode && (
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Monitor size={14} /> Environment Grid
                                </label>
                                <div className="space-y-2">
                                    {ROOMPRESETS.map((room) => (
                                        <button
                                            key={room.id}
                                            onClick={() => setActiveRoom(room)}
                                            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group ${activeRoom.id === room.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                                        >
                                            <div className="w-16 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                                                <img src={room.url} className="w-full h-full object-cover" />
                                            </div>
                                            <span className={`text-sm font-bold uppercase tracking-tight transition-colors ${activeRoom.id === room.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                                                {room.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Piece Calibration */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Scaling size={14} /> Dimensional Scaling
                            </label>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0.05"
                                    max="0.8"
                                    step="0.01"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                    <span>Compact</span>
                                    <span>Impactful</span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Spatial Rotation</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setRotation(r => r - 90)}
                                        className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        -90°
                                    </button>
                                    <button
                                        onClick={() => setRotation(r => r + 90)}
                                        className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                                    >
                                        +90°
                                    </button>
                                    <button
                                        onClick={() => { setScale(activeRoom.initialScale); setRotation(0); }}
                                        className="p-3 bg-white/5 rounded-xl text-zinc-400 hover:text-white hover:bg-blue-500 transition-all border border-white/5"
                                        title="Reset Optimization"
                                    >
                                        <RotateCcw size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CTA / Summary */}
                        <div className="pt-6">
                            <button
                                onClick={onClose}
                                className="w-full h-16 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 shadow-2xl shadow-blue-500/10 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                            >
                                Revert to Archive
                            </button>
                        </div>
                    </div>
                </aside>
            </motion.div>
        </AnimatePresence>
    );
}
