"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Upload, Move, Maximize2, X, RefreshCw, Smartphone } from "lucide-react";

/**
 * AR Demo Page
 * 
 * Allows users to upload a room photo and overlay artworks to visualize size/placement.
 * Features:
 * - Room Image Upload
 * - Artwork Selection (Mock list)
 * - Draggable & Resizable Overlay
 * - Mobile-friendly "View in AR" hint
 */
export default function ARDemo() {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedArt, setSelectedArt] = useState<string | null>(null);
  
  // Overlay State
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock Artworks
  const MOCK_ARTS = [
    "/next.svg", // Placeholder, ideally use real images
    "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&fit=crop",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=400&fit=crop",
  ];

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
      <Navbar />

      <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto h-[calc(100vh-20px)] flex flex-col lg:flex-row gap-6">
        
        {/* Editor Canvas (Left/Top) */}
        <div 
          className="flex-1 bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/10 group shadow-2xl"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {roomImage ? (
            <div className="relative w-full h-full">
              {/* Room Background */}
              <img 
                 src={roomImage} 
                 alt="Room Preview" 
                 className="w-full h-full object-cover select-none pointer-events-none" 
              />
              
              {/* Overlay Artwork */}
              {selectedArt && (
                <div 
                  className="absolute cursor-move shadow-2xl ring-4 ring-black/20"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    width: '30%', // Base width relative to room
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <img 
                    src={selectedArt} 
                    alt="Selected Art" 
                    className="w-full h-auto shadow-xl pointer-events-none border-[8px] border-white frame-shadow" 
                  />
                  
                  {/* Active Indicator */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Drag to Move
                  </div>
                </div>
              )}

              {/* Reset Button */}
              <button 
                onClick={() => setRoomImage(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          ) : (
            /* Upload Placeholder */
            <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4 p-6 border-2 border-dashed border-white/10 m-4 rounded-xl hover:border-rose-500/50 hover:bg-white/5 transition-all">
               <Upload className="w-12 h-12 text-zinc-500 mb-2" />
               <h3 className="text-xl font-medium text-white">Upload your Room</h3>
               <p className="text-center max-w-sm">
                 Take a photo of your wall and upload it here to see how the art fits in your space.
               </p>
               <label className="mt-4 px-6 py-3 bg-white text-black font-bold rounded-full cursor-pointer hover:bg-rose-500 hover:text-white transition-all">
                 Choose Photo
                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
               </label>
            </div>
          )}
        </div>

        {/* Sidebar Controls (Right/Bottom) */}
        <div className="w-full lg:w-80 flex flex-col gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5 h-fit">
           
           <div className="space-y-1">
             <h2 className="font-serif text-2xl">Virtual View</h2>
             <p className="text-sm text-zinc-400">Select an artwork to place it on the wall.</p>
           </div>

           {/* Art Selector */}
           <div className="grid grid-cols-2 gap-3">
             {MOCK_ARTS.map((art, i) => (
                <button 
                  key={i}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedArt === art ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-transparent hover:border-white/30'}`}
                  onClick={() => setSelectedArt(art)}
                >
                   <img src={art} className="w-full h-full object-cover" alt={`Art option ${i}`} />
                </button>
             ))}
           </div>
           
           {/* Size Control */}
           {selectedArt && (
             <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                   <span className="flex items-center gap-2"><Maximize2 className="w-4 h-4" /> Size</span>
                   <span className="text-rose-400 font-mono">{Math.round(scale * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.3" 
                  max="2" 
                  step="0.1"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
                <p className="text-xs text-zinc-500">
                  Tip: Use the slider to match the artwork scale to your real-life wall dimensions.
                </p>
             </div>
           )}

           {/* Mobile QRCode / Tip */}
           <div className="mt-auto pt-6 border-t border-white/10 flex items-center gap-4 text-zinc-400">
              <div className="p-3 bg-white/5 rounded-lg">
                <Smartphone className="w-6 h-6" />
              </div>
              <p className="text-xs leading-relaxed">
                Open this on your mobile phone to take a photo of your wall directly.
              </p>
           </div>
        </div>

      </main>
    </div>
  );
}
