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
    Image as ImageIcon,
    Phone,
    Globe,
    Zap,
    Fingerprint,
    Layers,
    Heart
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
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        portfolioUrl: '',
        mobile: '',
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

            // Check current role and status
            const { data: sellerData } = await supabase
                .from('sellers')
                .select('*')
                .eq('id', user.id)
                .single();

            if (sellerData) {
                setFormData({
                    fullName: sellerData.full_name || user.user_metadata?.full_name || '',
                    bio: sellerData.bio || '',
                    portfolioUrl: sellerData.portfolio_url || '',
                    mobile: sellerData.mobile || '',
                    avatarUrl: sellerData.avatar_url || AVATARS[0]
                });
                setStatus(sellerData.status || 'pending');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (step === 1 && !formData.fullName) return;
        if (step === 2 && !formData.bio) return;
        if (step === 3 && (!formData.portfolioUrl || !formData.mobile)) return;
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // 1. Update/Upsert Sellers Table
            const { error: sellerError } = await supabase
                .from('sellers')
                .upsert({
                    id: user.id,
                    full_name: formData.fullName,
                    email: user.email,
                    bio: formData.bio,
                    portfolio_url: formData.portfolioUrl,
                    mobile: formData.mobile,
                    avatar_url: formData.avatarUrl,
                    status: 'pending'
                });

            if (sellerError) throw sellerError;

            // 2. Updated: Removed profiles table update logic
            // 3. Update Auth Metadata
            await supabase.auth.updateUser({
                data: {
                    full_name: formData.fullName,
                    avatar_url: formData.avatarUrl,
                    role: 'seller'
                }
            });

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
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Status Screens (Same premium aesthetic)
    if (status === 'pending') {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8 bg-zinc-900/20 backdrop-blur-3xl border border-white/5 p-12 rounded-[3.5rem] shadow-2xl relative z-10"
                >
                    <div className="w-24 h-24 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
                        <Clock className="text-blue-400 animate-pulse" size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Curation <br />Stage Active</h1>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            Our collective is reviewing your portfolio. Quality is our highest priority. Expect a decision within 24 standard cycles.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push('/customer/dashboard')}
                            className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl"
                        >
                            Explore Gallery
                        </button>
                        <button
                            onClick={() => router.push('/customer/settings')}
                            className="text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest"
                        >
                            Review Digital Identity
                        </button>
                    </div>
                </motion.div>
            </main>
        );
    }

    if (status === 'approved') {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-8 bg-zinc-900/20 backdrop-blur-3xl border border-emerald-500/10 p-12 rounded-[3.5rem] shadow-2xl relative z-10"
                >
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                        <CheckCircle2 className="text-emerald-400" size={40} />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Residency <br />Confirmed</h1>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                            Welcome to the elite collective. Your private studio is now synchronized and ready for deployment.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/seller/dashboard')}
                        className="w-full py-6 bg-emerald-500 text-white font-black rounded-[2rem] hover:bg-emerald-400 transition-all uppercase tracking-[0.3em] text-[10px] shadow-[0_20px_40px_rgba(16,185,129,0.3)]"
                    >
                        Enter Creator Studio
                    </button>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#080808] text-white pt-24 pb-20 px-6 relative overflow-hidden flex items-center justify-center">
            {/* Ambient background */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                {/* Left Side: Visual Storytelling */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-5 space-y-12"
                >
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em]">
                            <Sparkles size={12} /> Artist Protocol v2.0
                        </div>

                        <h1 className="text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-white uppercase italic">
                            Elevate <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">Your</span> <br />
                            Craft.
                        </h1>

                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm font-medium tracking-wide">
                            Join an elite global collective of digital masters. We provide the infrastructure; you provide the vision.
                        </p>
                    </div>

                    <div className="space-y-6 pt-6">
                        {[
                            { icon: ShieldCheck, title: 'Curation First', desc: 'Maintain elite value in a hand-picked environment.', color: 'text-blue-500' },
                            { icon: Zap, title: 'Instant Liquidity', desc: 'Secure payment protocols and direct collector access.', color: 'text-amber-500' },
                            { icon: Layers, title: 'Studio Tools', desc: 'Complete inventory and exhibition management suite.', color: 'text-purple-500' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 items-start group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900/50 border border-white/5 flex items-center justify-center shrink-0 transition-all group-hover:border-white/10 group-hover:bg-zinc-900">
                                    <feature.icon className={feature.color} size={20} />
                                </div>
                                <div className="pt-1">
                                    <h3 className="font-bold text-white text-[11px] uppercase tracking-widest leading-none mb-1">{feature.title}</h3>
                                    <p className="text-[10px] text-zinc-600 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: The Multi-Step Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-7 relative"
                >
                    <div className="bg-zinc-900/10 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">

                        {/* Progress Marker */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900">
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: `${(step / 4) * 100}%` }}
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Identity Core</h2>
                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Define your professional presence</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Visual Persona</label>
                                            <div className="grid grid-cols-6 gap-3">
                                                {AVATARS.map((url, i) => (
                                                    <button
                                                        key={url}
                                                        onClick={() => setFormData({ ...formData, avatarUrl: url })}
                                                        className={`aspect-square rounded-2xl overflow-hidden transition-all duration-500 ${formData.avatarUrl === url ? 'ring-2 ring-blue-500 scale-110 shadow-lg' : 'opacity-20 grayscale hover:opacity-100'}`}
                                                    >
                                                        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Professional Moniker</label>
                                            <div className="relative">
                                                <Fingerprint className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-7 py-5 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
                                                    placeholder="e.g. Satoshi_Creator"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!formData.fullName}
                                        onClick={handleNextStep}
                                        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                                    >
                                        Initialize Protocol <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest mb-4">
                                            <ChevronLeft size={14} /> Back
                                        </button>
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Mission Statement</h2>
                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Your narrative within the collective</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Artist Bio (Manifesto)</label>
                                        <div className="relative">
                                            <FileText className="absolute left-6 top-6 text-zinc-700" size={16} />
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full bg-black/40 border border-white/5 rounded-3xl pl-14 pr-7 py-6 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800 min-h-[180px] resize-none"
                                                placeholder="Tell us about your artistic origin and current vision..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={!formData.bio}
                                        onClick={handleNextStep}
                                        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                                    >
                                        Seal Manifesto <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="space-y-2">
                                        <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest mb-4">
                                            <ChevronLeft size={14} /> Back
                                        </button>
                                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Proof of Work</h2>
                                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Validation and communication lines</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Portfolio (ArtStation/Behance)</label>
                                            <div className="relative">
                                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                <input
                                                    type="url"
                                                    value={formData.portfolioUrl}
                                                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-7 py-5 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Secure Contact Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                <input
                                                    type="tel"
                                                    value={formData.mobile}
                                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-7 py-5 text-sm font-bold text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-800"
                                                    placeholder="+91..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!formData.portfolioUrl || !formData.mobile}
                                        onClick={handleNextStep}
                                        className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                                    >
                                        Final Verification <ArrowRight size={18} />
                                    </button>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-12 text-center"
                                >
                                    <div className="space-y-6">
                                        <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-blue-500/20">
                                            <ShieldCheck className="text-blue-500" size={32} />
                                        </div>
                                        <div className="space-y-3">
                                            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Review Protocol</h2>
                                            <p className="text-zinc-500 text-sm font-medium italic">"Once submitted, your data enters the curation queue."</p>
                                        </div>
                                    </div>

                                    <div className="p-8 rounded-[2.5rem] bg-zinc-950/50 border border-white/5 text-left space-y-4">
                                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                            <img src={formData.avatarUrl} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <p className="text-[8px] font-black uppercase text-zinc-600">Moniker</p>
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{formData.fullName}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-[10px]">
                                            <div>
                                                <p className="text-zinc-600 uppercase font-black mb-1">Portfolio</p>
                                                <p className="text-white font-bold truncate">{formData.portfolioUrl}</p>
                                            </div>
                                            <div>
                                                <p className="text-zinc-600 uppercase font-black mb-1">Communications</p>
                                                <p className="text-white font-bold">{formData.mobile}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-3xl hover:bg-blue-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-[0_20px_40px_rgba(37,99,235,0.3)]"
                                        >
                                            {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Commit Application <ArrowRight size={18} /></>}
                                        </button>
                                        <button
                                            onClick={() => setStep(3)}
                                            className="text-zinc-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest"
                                        >
                                            Re-verify Parameters
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Visual Footnote */}
                        <div className="absolute bottom-6 left-0 w-full text-center px-10 pointer-events-none">
                            <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.4em]">Integrated Curation Network • Node-42</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
