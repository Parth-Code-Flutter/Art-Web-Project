"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { calculateSmartPrice, generateImageTags } from "@/lib/ai-utils";
import { Upload, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";

/**
 * Seller Upload Page
 * 
 * Demonstrates the AI Tools:
 * 1. Image Upload -> AI Tagging
 * 2. Dimension Input -> Smart Price Calculation
 */
export default function SellPage() {
    // Image State
    const [image, setImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    // Pricing State
    const [dimensions, setDimensions] = useState({ width: 50, height: 50 });
    const [priceData, setPriceData] = useState<{ min: number; max: number; suggested: number } | null>(null);

    // 1. Handle Image Upload & Auto-Tagging
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create local preview
            const url = URL.createObjectURL(file);
            setImage(url);
            setTags([]); // Reset tags

            // Simulate AI Analysis
            setIsAnalyzing(true);
            try {
                // Pass the file URL (or name as mock) to our utility
                const newTags = await generateImageTags(file.name);
                setTags(newTags);
            } catch (error) {
                console.error("AI Tagging Failed", error);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };

    // 2. Handle Smart Pricing Calculation
    const handleCalculatePrice = () => {
        const result = calculateSmartPrice({
            width: dimensions.width,
            height: dimensions.height,
            medium: 'oil', // Hardcoded for demo, normally a dropdown
            experienceLevel: 'intermediate'
        });
        setPriceData(result);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />

            <main className="pt-28 px-4 max-w-4xl mx-auto pb-20">
                <h1 className="font-serif text-4xl mb-2">List your Masterpiece</h1>
                <p className="text-zinc-400 mb-12">
                    Use our AI-powered tools to categorize and price your artwork correctly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Section 1: Upload & AI Tagging */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            1. Upload Artwork
                        </h2>

                        <div className="aspect-square bg-zinc-900 border-2 border-dashed border-white/10 rounded-xl relative flex flex-col items-center justify-center overflow-hidden group hover:border-rose-500/50 transition-colors">
                            {image ? (
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <Upload className="w-10 h-10 mx-auto mb-4 text-zinc-500" />
                                    <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* Tags Output */}
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 min-h-[100px]">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-rose-500" /> AI Suggested Tags
                                </span>
                                {isAnalyzing && <Loader2 className="w-4 h-4 animate-spin text-rose-500" />}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {tags.length > 0 ? (
                                    tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-rose-500 transition-colors cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-zinc-600 italic">
                                        {isAnalyzing ? "Analyzing image textures..." : "Upload an image to generate tags"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Smart Pricing */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            2. Smart Pricing
                        </h2>

                        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500">Width (cm)</label>
                                    <input
                                        type="number"
                                        value={dimensions.width}
                                        onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500">Height (cm)</label>
                                    <input
                                        type="number"
                                        value={dimensions.height}
                                        onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCalculatePrice}
                                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                            >
                                Calculate Recommended Price
                            </button>

                            {priceData && (
                                <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-3 mb-2 text-rose-400">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="font-bold">Estimated Market Value</span>
                                    </div>
                                    <div className="text-3xl font-serif font-bold text-white mb-1">
                                        ${priceData.suggested}
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        Range: ${priceData.min} - ${priceData.max} <br />
                                        <span className="text-xs opacity-70">Based on intermediate Oil Painting rates</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
