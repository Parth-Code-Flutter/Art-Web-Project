'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

interface FilterOptions {
    categories: string[];
    priceRange: [number, number];
}

interface ProductFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile?: boolean;
    availableCategories: string[];
    onFilterChange: (filters: FilterOptions) => void;
    currentFilters: FilterOptions;
}

const PRICE_RANGES = [
    { label: 'All Prices', min: 0, max: Infinity },
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
    { label: 'Above ₹5,000', min: 5000, max: Infinity },
];

export default function ProductFilters({
    isOpen,
    onClose,
    isMobile = false,
    availableCategories,
    onFilterChange,
    currentFilters
}: ProductFiltersProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(currentFilters.categories);
    const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>(currentFilters.priceRange);
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    useEffect(() => {
        setSelectedCategories(currentFilters.categories);
        setSelectedPriceRange(currentFilters.priceRange);
    }, [currentFilters]);

    const handleCategoryToggle = (category: string) => {
        const updated = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(updated);
    };

    const handlePriceRangeSelect = (min: number, max: number) => {
        setSelectedPriceRange([min, max]);
    };

    const applyFilters = () => {
        onFilterChange({
            categories: selectedCategories,
            priceRange: selectedPriceRange
        });
        if (isMobile) {
            onClose();
        }
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedPriceRange([0, Infinity]);
        onFilterChange({
            categories: [],
            priceRange: [0, Infinity]
        });
    };

    const hasActiveFilters = selectedCategories.length > 0 ||
        (selectedPriceRange[0] !== 0 || selectedPriceRange[1] !== Infinity);

    const FilterContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <SlidersHorizontal className="text-blue-400" size={20} />
                    <h3 className="text-lg font-bold text-white">Filters</h3>
                </div>
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                {/* Categories Filter */}
                <div>
                    <button
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full flex items-center justify-between mb-3 text-sm font-bold text-white uppercase tracking-wider"
                    >
                        <span>Categories</span>
                        <ChevronDown
                            size={16}
                            className={`text-zinc-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {availableCategories.map((category) => (
                                    <label
                                        key={category}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedCategories.includes(category)
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-zinc-700 group-hover:border-zinc-600'
                                            }`}>
                                            {selectedCategories.includes(category) && (
                                                <Check size={14} className="text-white" />
                                            )}
                                        </div>
                                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">
                                            {category}
                                        </span>
                                        <span className="text-xs text-zinc-600 font-medium">
                                            {/* Could add count here if needed */}
                                        </span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Price Range Filter */}
                <div>
                    <button
                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                        className="w-full flex items-center justify-between mb-3 text-sm font-bold text-white uppercase tracking-wider"
                    >
                        <span>Price Range</span>
                        <ChevronDown
                            size={16}
                            className={`text-zinc-500 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    <AnimatePresence>
                        {isPriceOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-2 overflow-hidden"
                            >
                                {PRICE_RANGES.map((range) => {
                                    const isSelected = selectedPriceRange[0] === range.min &&
                                        selectedPriceRange[1] === range.max;
                                    return (
                                        <button
                                            key={range.label}
                                            onClick={() => handlePriceRangeSelect(range.min, range.max)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isSelected
                                                    ? 'bg-blue-500/10 border border-blue-500/20'
                                                    : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                        >
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                                                    ? 'border-blue-500'
                                                    : 'border-zinc-700'
                                                }`}>
                                                {isSelected && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <span className={`text-sm transition-colors ${isSelected ? 'text-white font-semibold' : 'text-zinc-300'
                                                }`}>
                                                {range.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 lg:p-6 border-t border-white/10 space-y-3">
                <button
                    onClick={applyFilters}
                    className="w-full py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors"
                >
                    Apply Filters
                </button>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="w-full py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    );

    if (isMobile) {
        return (
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1001]"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-900 border-l border-white/10 z-[1002] shadow-2xl"
                        >
                            <FilterContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        );
    }

    // Desktop sidebar
    return (
        <div className="sticky top-24 bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden h-fit">
            <FilterContent />
        </div>
    );
}
