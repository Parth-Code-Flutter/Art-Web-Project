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
    ChevronLeft,
    Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const AVATARS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
];

export default function BecomeArtistPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
    const [profile, setProfile] = useState<any>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        portfolioUrl: '',
        avatarUrl: AVATARS[0]
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
                .from('sellers')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile(data);
                setFormData({
                    fullName: data.full_name || user.user_metadata?.full_name || '',
                    bio: data.bio || '',
                    portfolioUrl: data.portfolio_url || '',
                    avatarUrl: data.avatar_url || AVATARS[0]
                });
                setStatus(data.status || 'pending');
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
                .from('sellers')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                    email: user.email,
                    bio: formData.bio,
                    portfolio_url: formData.portfolioUrl,
                    avatar_url: formData.avatarUrl,
                    status: 'pending'
                });

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
            <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full text-center space-y-8 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative z-10"
                >
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                        <Clock className="text-blue-400 animate-pulse" size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Application <br />Under Review</h1>
                    <p className="text-zinc-500 leading-relaxed font-medium">
                        Our curators are currently reviewing your portfolio to ensure it matches the gallery's standards. We typically respond within 24-48 hours.
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push('/customer/dashboard')}
                            className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs"
                        >
                            Return to Gallery
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="w-full py-4 bg-zinc-900 border border-white/10 text-zinc-500 font-bold rounded-2xl hover:text-white transition-all uppercase tracking-widest text-xs"
                        >
                            Log Out
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    if (status === 'approved') {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl w-full text-center space-y-8 bg-zinc-900/40 backdrop-blur-2xl border border-emerald-500/20 p-12 rounded-[3rem] shadow-2xl relative z-10"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-400" size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Welcome <br />to the Collective</h1>
                    <p className="text-zinc-500 leading-relaxed font-medium">
                        Your artist application has been approved. Your private studio dashboard is now ready for your first collection.
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push('/seller/dashboard')}
                            className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-500/20"
                        >
                            Enter Creator Studio
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="w-full py-4 bg-zinc-900 border border-white/10 text-zinc-500 font-bold rounded-2xl hover:text-white transition-all uppercase tracking-widest text-xs"
                        >
                            Sign Out
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    if (status === 'rejected') {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl w-full text-center space-y-8 bg-zinc-900/40 backdrop-blur-2xl border border-red-500/20 p-12 rounded-[3rem] shadow-2xl relative z-10"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                        <AlertCircle className="text-red-400" size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Portfolio <br />Update Required</h1>
                    <p className="text-zinc-500 leading-relaxed font-medium">
                        Unfortunately, your current portfolio doesn't align with our gallery's direction at this time. You are welcome to update your work and re-apply.
                    </p>
                    <div className="flex flex-col gap-4 text-center">
                        <button
                            onClick={() => router.push('/customer/dashboard')}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-white font-black uppercase tracking-widest text-xs"
                        >
                            Return to Gallery
                        </button>
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                router.push('/login');
                            }}
                            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs"
                        >
                            Sign Out and Re-Apply
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
            {/* Ambient background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -ml-32 -mb-32 pointer-events-none" />

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Side: Visual Storytelling */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={12} /> Residency Application
                        </div>

                        <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.8] text-white uppercase italic">
                            Claim <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Your</span> <br />
                            Space.
                        </h1>

                        <p className="text-zinc-500 text-lg leading-relaxed max-w-sm font-medium">
                            Join our curated collective of digital masters and showcase your vision to elite global collectors.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 pt-6">
                        <div className="flex gap-5 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/5">
                                <ShieldCheck className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-tight text-sm italic">Curated Quality</h3>
                                <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-1">Every artist is hand-picked to maintain elite standards.</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center shrink-0 shadow-xl shadow-purple-500/5">
                                <Palette className="text-purple-500" size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-white uppercase tracking-tight text-sm italic">Direct Ownership</h3>
                                <p className="text-xs text-zinc-600 font-medium leading-relaxed mt-1">Complete control over your pricing and distribution.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: The Form */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                    <div className="relative bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
                        <div className="mb-12 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Studio Setup</h2>
                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Initialize your profile</p>
                            </div>
                            <FileText size={32} className="text-zinc-800" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Avatar Picker Section */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <ImageIcon size={12} /> Choose Your Identity
                                </label>
                                <div className="grid grid-cols-6 gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                                    {AVATARS.map((url, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, avatarUrl: url })}
                                            className={`relative aspect - square rounded - xl overflow - hidden transition - all duration - 300 ${formData.avatarUrl === url
                                                    ? 'ring-2 ring-blue-500 scale-110 shadow-lg shadow-blue-500/20'
                                                    : 'opacity-40 hover:opacity-100 hover:scale-105 hover:shadow-lg'
                                                } `}
                                        >
                                            <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <User size={12} /> Professional Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-zinc-800 text-sm"
                                    placeholder="e.g. Satoshi Master"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <FileText size={12} /> Artist Bio
                                </label>
                                <textarea
                                    required
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-zinc-800 min-h-[100px] resize-none text-sm"
                                    placeholder="Your artistic journey and style..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                    <LinkIcon size={12} /> Portfolio URL
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={formData.portfolioUrl}
                                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-blue-500/50 transition-all font-bold placeholder:text-zinc-800 text-sm"
                                    placeholder="https://artstation.com/yourname"
                                />
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-16 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)]"
                                >
                                    {submitting ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>Submit Application <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>

                            <p className="text-center text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-6 leading-relaxed">
                                By submitting, you agree to our <br />
                                <span className="text-zinc-400 cursor-pointer hover:text-white transition-colors">Quality Assurance Guidelines</span>
                            </p>
                        </form>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
