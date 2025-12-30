'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, MapPin, Truck, AlertCircle, Search, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShippingRule {
    id: string;
    country: string;
    state?: string;
    city?: string;
    amount: number;
    estimated_days?: string;
}

export default function ShippingManager() {
    const [rules, setRules] = useState<ShippingRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newRule, setNewRule] = useState<Partial<ShippingRule>>({
        country: 'India',
        amount: 0,
        estimated_days: '5-7 Days'
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const { data, error } = await supabase
                .from('shipping_rules')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRules(data || []);
        } catch (error) {
            console.error('Error fetching shipping rules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('shipping_rules')
                .insert([newRule]);

            if (error) throw error;

            await fetchRules();
            setIsAdding(false);
            setNewRule({ country: 'India', amount: 0, estimated_days: '5-7 Days' });
        } catch (error) {
            console.error('Error saving rule:', error);
            alert('Failed to save shipping rule');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this shipping rule?')) return;

        try {
            const { error } = await supabase
                .from('shipping_rules')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRules(rules.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting rule:', error);
        }
    };

    const filteredRules = rules.filter(rule =>
        rule.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">Shipping Configuration</h2>
                    <p className="text-zinc-400">Manage delivery charges and shipping zones globally.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus size={18} /> New Rule
                </button>
            </header>

            {/* Stats / Overview Cards could go here */}

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                    type="text"
                    placeholder="Search zones (Country, State, City)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {loading && !isAdding ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {filteredRules.map((rule) => (
                            <motion.div
                                key={rule.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                            {rule.country === 'All' ? <Globe size={20} /> : <MapPin size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{rule.city || rule.state || rule.country}</h3>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                                {rule.city ? `${rule.state}, ${rule.country}` : rule.state ? rule.country : 'Global Region'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(rule.id)}
                                        className="p-2 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-400 text-xs mb-1">Shipping Cost</span>
                                        <span className="text-xl font-mono font-bold text-white">₹{rule.amount}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-zinc-400 text-xs mb-1">Est. Delivery</span>
                                        <span className="text-sm font-medium text-emerald-400 flex items-center gap-1">
                                            <Truck size={12} /> {rule.estimated_days}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredRules.length === 0 && (
                        <div className="col-span-full py-12 text-center text-zinc-500 border border-dashed border-white/10 rounded-xl">
                            <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No shipping rules found for this zone.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Add Rule Modal Overlay */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-6">Add New Shipping Rule</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Country</label>
                                    <input
                                        type="text"
                                        value={newRule.country}
                                        onChange={(e) => setNewRule({ ...newRule, country: e.target.value })}
                                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                        placeholder="e.g. India"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">State (Optional)</label>
                                        <input
                                            type="text"
                                            value={newRule.state || ''}
                                            onChange={(e) => setNewRule({ ...newRule, state: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                            placeholder="e.g. Maharashtra"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">City (Optional)</label>
                                        <input
                                            type="text"
                                            value={newRule.city || ''}
                                            onChange={(e) => setNewRule({ ...newRule, city: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                            placeholder="e.g. Mumbai"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Charge (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                            <input
                                                type="number"
                                                value={newRule.amount}
                                                onChange={(e) => setNewRule({ ...newRule, amount: Number(e.target.value) })}
                                                className="w-full bg-black border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Est. Delivery</label>
                                        <input
                                            type="text"
                                            value={newRule.estimated_days || ''}
                                            onChange={(e) => setNewRule({ ...newRule, estimated_days: e.target.value })}
                                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none"
                                            placeholder="5-7 Days"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckIcon />}
                                    Save Rule
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    )
}
