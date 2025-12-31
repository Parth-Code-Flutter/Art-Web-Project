'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SearchResult {
    id: string;
    name: string;
    category: string;
    price: number;
    discount_price?: number;
    images: string[];
}

interface SearchBarProps {
    onClose?: () => void;
    isMobile?: boolean;
}

export default function SearchBar({ onClose, isMobile = false }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Auto-focus on mount for mobile
    useEffect(() => {
        if (isMobile && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMobile]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search products
    useEffect(() => {
        const searchProducts = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('id, name, category, price, discount_price, images')
                    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
                    .eq('status', 'approved')
                    .limit(5);

                if (error) throw error;
                setResults(data || []);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounce = setTimeout(searchProducts, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const saveRecentSearch = (searchTerm: string) => {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleResultClick = (product: SearchResult) => {
        saveRecentSearch(product.name);
        router.push(`/customer/products/${product.id}`);
        setQuery('');
        setIsOpen(false);
        onClose?.();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            saveRecentSearch(query);
            router.push(`/customer/products?search=${encodeURIComponent(query)}`);
            setQuery('');
            setIsOpen(false);
            onClose?.();
        }
    };

    const handleRecentClick = (term: string) => {
        setQuery(term);
        inputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div ref={searchRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-xl'}`}>
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search artworks, artists, categories..."
                        className="w-full h-11 lg:h-12 pl-12 pr-12 rounded-xl lg:rounded-2xl bg-zinc-900/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 focus:bg-zinc-900 transition-all"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setResults([]);
                                inputRef.current?.focus();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
                {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                    >
                        {/* Loading State */}
                        {isLoading && (
                            <div className="p-8 text-center">
                                <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm text-zinc-500 mt-3">Searching...</p>
                            </div>
                        )}

                        {/* Search Results */}
                        {!isLoading && query.length >= 2 && (
                            <>
                                {results.length > 0 ? (
                                    <div className="p-2">
                                        <p className="px-3 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                            Results
                                        </p>
                                        {results.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleResultClick(product)}
                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-zinc-500 truncate">{product.category}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="text-sm font-bold text-white">
                                                        {formatPrice(product.discount_price || product.price)}
                                                    </p>
                                                    {product.discount_price && (
                                                        <p className="text-xs text-zinc-600 line-through">
                                                            {formatPrice(product.price)}
                                                        </p>
                                                    )}
                                                </div>
                                                <ArrowRight size={16} className="text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                        <button
                                            onClick={handleSearch}
                                            className="w-full mt-2 p-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
                                        >
                                            View all results for "{query}"
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-zinc-400">No results found for "{query}"</p>
                                        <p className="text-xs text-zinc-600 mt-2">Try different keywords</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Recent Searches */}
                        {!isLoading && query.length < 2 && recentSearches.length > 0 && (
                            <div className="p-2">
                                <div className="flex items-center justify-between px-3 py-2">
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                        <Clock size={12} />
                                        Recent Searches
                                    </p>
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-xs text-zinc-600 hover:text-white transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                                {recentSearches.map((term, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleRecentClick(term)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                                    >
                                        <Clock size={16} className="text-zinc-600" />
                                        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors flex-1">
                                            {term}
                                        </span>
                                        <TrendingUp size={14} className="text-zinc-700 group-hover:text-blue-400 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
