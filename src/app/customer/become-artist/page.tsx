'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Sparkles,
    ArrowRight,
    ShieldCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Link as LinkIcon,
    FileText,
    Loader2,
    ChevronLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function BecomeArtistPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
    const [profile, setProfile] = useState<any>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        portfolioUrl: ''
    });

    useEffect(() => {
        fetchProfileStatus();
    }, []);

    const fetchProfileStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData({
                    fullName: data.full_name || user.user_metadata?.full_name || '',
                    bio: data.bio || '',
                    portfolioUrl: data.portfolio_url || ''
                });

                if (data.role === 'seller') {
                    setStatus(data.status || 'pending');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.fullName,
                    bio: formData.bio,
                    portfolio_url: formData.portfolioUrl,
                    role: 'seller',
                    status: 'pending'
                })
                .eq('id', user.id);

            if (error) throw error;
            setStatus('pending');
        } catch (error: any) {
            alert(error.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    // Render Status-specific screens
    if (status === 'pending') {
        return (
            <main className="min-h-screen bg-black text-white pt-20 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-12 text-center backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20" />
                    <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mx-auto mb-8 animate-pulse">
                        <Clock size={40} />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight uppercase">Application Under Review</h1>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        Our curators are currently reviewing your portfolio. This verification protocol typically takes 24-48 cycles. You will be notified once high-clearance access is granted.
                    </p>
                    <button
                        onClick={() => router.push('/customer/dashboard')}
                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm tracking-widest uppercase"
                    >
                        Return to Gallery
                    </button>
                </motion.div>
            </main>
        );
    }

    if (status === 'approved') {
        return (
            <main className="min-h-screen bg-black text-white pt-20 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-12 text-center backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20" />
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
                        <CheckCircle2 size={40} />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight uppercase">Access Granted</h1>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        Welcome to the Collective. Your credentials have been verified. You now have permission to showcase your masterpieces in the global grid.
                    </p>
                    <button
                        onClick={() => router.push('/seller/dashboard')}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all font-bold tracking-widest uppercase text-sm"
                    >
                        Enter Creator Studio
                    </button>
                </motion.div>
            </main>
        );
    }

    if (status === 'rejected') {
        return (
            <main className="min-h-screen bg-black text-white pt-20 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-12 text-center backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20" />
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-8">
                        <AlertCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-black mb-4 tracking-tight uppercase">Transmission Denied</h1>
                    <p className="text-zinc-400 leading-relaxed mb-8">
                        Our curators have completed the synchronization of your portfolio. At this moment, your artistic trajectory does not align with our current gallery sequence.
                    </p>
                    <button
                        onClick={() => router.push('/customer/dashboard')}
                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-sm tracking-widest uppercase"
                    >
                        Return to Gallery
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Visual Side */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-8"
                >
                    <button
                        onClick={() => router.push('/customer/settings')}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-8"
                    >
                        <ChevronLeft size={16} /> Back to Settings
                    </button>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Sparkles size={12} /> Artist Application
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none text-white uppercase">
                        Become an <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Official</span> <br />
                        Artist.
                    </h1>

                    <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                        Join our exclusive community of artists. Showcase your work to collectors from around the world in our premium digital gallery.
                    </p>

                    <div className="space-y-6 pt-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                <ShieldCheck className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase tracking-tight">Hand-Picked Talent</h3>
                                <p className="text-sm text-zinc-500">Every artist is manually reviewed to maintain gallery quality.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0">
                                <Palette className="text-purple-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase tracking-tight">Global Exposure</h3>
                                <p className="text-sm text-zinc-500">Exhibit your work to high-end collectors worldwide.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500" />

                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Artist Application</h2>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Join the Collective</p>
                        </div>
                        <FileText size={32} className="text-zinc-800" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <User size={12} /> Your Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-zinc-700"
                                placeholder="Your professional name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <FileText size={12} /> Your Artist Bio
                            </label>
                            <textarea
                                required
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-zinc-700 min-h-[120px] resize-none"
                                placeholder="Tell us about yourself and your art style..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <LinkIcon size={12} /> Portfolio Link (URL)
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.portfolioUrl}
                                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                className="w-full bg-black/50 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold placeholder:text-zinc-700"
                                placeholder="Link to Behance, Instagram, or Website"
                            />
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
                            >
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : <>Submit Application <ArrowRight size={20} /></>}
                            </button>
                        </div>

                        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-6">
                            By submitting, you agree to our Artist quality guidelines.
                        </p>
                    </form>
                </motion.div>
            </div>
        </main>
    );
}
