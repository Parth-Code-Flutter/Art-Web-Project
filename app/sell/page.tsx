"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { calculateSmartPrice, generateImageTags } from "@/lib/ai-utils";
import { Upload, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { createArtwork } from "@/app/actions/createArtwork";

/**
 * Seller Upload Page
 * 
 * Connected to Supabase via Server Action.
 * Features AI Tagging and Smart Pricing.
 */
export default function SellPage() {
    // Image State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    // Pricing State
    const [dimensions, setDimensions] = useState({ width: 50, height: 50 });
    const [priceData, setPriceData] = useState<{ min: number; max: number; suggested: number } | null>(null);
    const [category, setCategory] = useState("Oil");

    // 1. Handle Image Upload & Auto-Tagging
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create local preview
            const url = URL.createObjectURL(file);
            setImagePreview(url);
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
            medium: category.toLowerCase() as any,
            experienceLevel: 'intermediate'
        });
        setPriceData(result);
    };

    // ...
    // 3. Handle Form Submission
    const handleSubmit = async (formData: FormData) => {
        // Append JSON tags manually if needed, or rely on hidden input (which is already there)
        const result = await createArtwork(formData);
        if (result?.error) {
            console.error(result.error);
            alert("Failed to create artwork: " + result.error);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500">
            <Navbar />

            <main className="pt-28 px-4 max-w-4xl mx-auto pb-20">
                <h1 className="font-serif text-4xl mb-2">List your Masterpiece</h1>
                <p className="text-zinc-400 mb-12">
                    Use our AI-powered tools to categorize and price your artwork correctly.
                </p>

                {/* Main Form requesting Server Action */}
                <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
    // ...

                    {/* Left Column: Image & AI */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            1. Upload Artwork
                        </h2>

                        {/* Hidden Input for Tags (passed as JSON string) */}
                        <input type="hidden" name="tags" value={JSON.stringify(tags)} />

                        <div className="aspect-square bg-zinc-900 border-2 border-dashed border-white/10 rounded-xl relative flex flex-col items-center justify-center overflow-hidden group hover:border-rose-500/50 transition-colors">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-6">
                                    <Upload className="w-10 h-10 mx-auto mb-4 text-zinc-500" />
                                    <p className="text-sm text-zinc-400">Click to upload or drag and drop</p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                required
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>

                        {/* AI Tags Display */}
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
                                        <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-rose-500 transition-colors">
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

                    {/* Right Column: Details & Pricing */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            2. Artwork Details
                        </h2>

                        <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 space-y-6">

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500">Title</label>
                                <input type="text" name="title" required placeholder="e.g. The Golden Hour" className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors" />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500">Description</label>
                                <textarea name="description" rows={3} placeholder="Tell the story behind this piece..." className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors" />
                            </div>

                            {/* Category Dropdown */}
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-zinc-500">Medium / Category</label>
                                <select
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors"
                                >
                                    <option value="Oil">Oil Painting</option>
                                    <option value="Acrylic">Acrylic</option>
                                    <option value="Digital">Digital Art</option>
                                    <option value="Sculpture">Sculpture</option>
                                    <option value="Photography">Photography</option>
                                </select>
                            </div>

                            {/* Dimensions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500">Width (cm)</label>
                                    <input
                                        type="number"
                                        name="width"
                                        required
                                        value={dimensions.width}
                                        onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500">Height (cm)</label>
                                    <input
                                        type="number"
                                        name="height"
                                        required
                                        value={dimensions.height}
                                        onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 focus:border-rose-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Smart Price Button */}
                            <button
                                type="button"
                                onClick={handleCalculatePrice}
                                className="w-full py-2 bg-white/5 border border-white/10 text-zinc-300 font-medium rounded-lg hover:bg-white/10 transition-all text-sm"
                            >
                                ✨ Calculate AI Price Estimate
                            </button>

                            {/* Price Result & Input */}
                            <div className="space-y-2 pt-2">
                                {priceData && (
                                    <div className="text-xs text-rose-400 mb-2">
                                        Suggested Range: ${priceData.min} - ${priceData.max}
                                    </div>
                                )}
                                <label className="text-xs uppercase tracking-wider text-zinc-500">Price (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-zinc-500">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        required
                                        placeholder={priceData ? `${priceData.suggested}` : "00.00"}
                                        step="0.01"
                                        className="w-full bg-black border border-white/10 rounded-lg p-3 pl-8 focus:border-rose-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-rose-600 text-white font-bold rounded-full hover:bg-rose-700 transition-all hover:scale-[1.02] shadow-lg shadow-rose-900/20"
                        >
                            Publish Artwork
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
