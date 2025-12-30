'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Globe, Loader2, Sparkles, Palette, Image as ImageIcon } from 'lucide-react';

interface CustomerAuthProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: 'customer' | 'seller';
}

const AVATARS = [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop',
];

export default function CustomerAuth({ isOpen, onClose, initialType = 'customer' }: CustomerAuthProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [type, setType] = useState<'customer' | 'seller'>(initialType);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('IN');
    const [avatarUrl, setAvatarUrl] = useState(AVATARS[0]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Sync type with initialType when modal opens
    useEffect(() => {
        if (isOpen) {
            setType(initialType);
            setMode('login'); // Always start at login for a clean state
            setEmail('');
            setPassword('');
        }
    }, [isOpen, initialType]);

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');
        setMobile('');
    };

    const validateForm = () => {
        if (mode === 'register') {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return false;
            }
            if (password.length < 6) {
                alert('Password must be at least 6 characters.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (mode === 'register') {
                // 1. Sign up with Supabase Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: fullName,
                            phone: mobile,
                            role: type,
                            avatar_url: avatarUrl
                        }
                    }
                });

                if (authError) throw authError;

                if (authData.user) {
                    if (type === 'customer') {
                        // 2. Insert into public.customers
                        const { error: dbError } = await supabase
                            .from('customers')
                            .upsert({
                                id: authData.user.id,
                                full_name: fullName,
                                email,
                                mobile: mobile || null,
                                country,
                                avatar_url: avatarUrl || null
                            }, { onConflict: 'id' });

                        if (dbError) throw dbError;
                    } else if (type === 'seller') {
                        // 2. Insert into public.sellers
                        const { error: dbError } = await supabase
                            .from('sellers')
                            .upsert({
                                id: authData.user.id,
                                full_name: fullName,
                                email,
                                mobile: mobile || null,
                                avatar_url: avatarUrl || null,
                                status: 'pending'
                            }, { onConflict: 'id' });

                        if (dbError) throw dbError;
                    }
                }

                if (type === 'seller') {
                    alert('Artist registration submitted! Our curators will review your profile shortly.');
                } else {
                    alert('Welcome to the Gallery! Your account has been created.');
                }
                setMode('login');
            } else {
                // Sign in
                const { data, error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (loginError) throw loginError;

                // 2. Role-Based Table Check
                if (type === 'seller') {
                    const { data: seller, error: sellerError } = await supabase
                        .from('sellers')
                        .select('status')
                        .eq('id', data.user.id)
                        .single();

                    if (sellerError || !seller) {
                        await supabase.auth.signOut();
                        throw new Error('This account is not registered as an Artist. Please use the Buyer / Collector login portal.');
                    }

                    onClose();
                    if (seller.status === 'approved') {
                        window.location.href = '/seller/dashboard';
                    } else {
                        window.location.href = '/customer/become-artist';
                    }
                } else {
                    const { data: customer, error: customerError } = await supabase
                        .from('customers')
                        .select('id')
                        .eq('id', data.user.id)
                        .single();

                    if (customerError || !customer) {
                        // Check if they are actually a seller trying to login as customer
                        const { data: isSeller } = await supabase.from('sellers').select('id').eq('id', data.user.id).single();
                        if (isSeller) {
                            await supabase.auth.signOut();
                            throw new Error('This is an Artist account. Please use the Artist / Creator login portal.');
                        }
                        await supabase.auth.signOut();
                        throw new Error('Account not found in our records.');
                    }

                    onClose();
                    window.location.href = '/customer/dashboard';
                }
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={`relative w-full overflow-hidden ${mode === 'register' ? 'max-w-2xl' : 'max-w-md'
                            } bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl`}
                    >
                        {/* Decorative Background */}
                        <div className={`absolute -top-24 -left-24 w-64 h-64 blur-[100px] rounded-full opacity-20 ${type === 'seller' ? 'bg-violet-600' : 'bg-blue-600'
                            }`} />
                        <div className={`absolute -bottom-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-20 ${type === 'seller' ? 'bg-violet-600' : 'bg-blue-600'
                            }`} />

                        {/* Top Bar Accent */}
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${type === 'seller'
                            ? 'from-violet-500/20 via-violet-500 to-violet-500/20'
                            : 'from-blue-500/20 via-blue-500 to-blue-500/20'
                            }`} />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12 relative z-0">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase mb-4 ${type === 'seller'
                                    ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                    }`}>
                                    {type === 'seller' ? <Palette size={14} /> : <Sparkles size={14} />}
                                    {type === 'seller' ? 'Artist Studio' : 'Collector Lounge'}
                                </div>
                                <h2 className="text-3xl font-heading font-black text-white mb-2 uppercase tracking-tighter">
                                    {mode === 'login'
                                        ? (type === 'seller' ? 'Artist Login' : 'Collector Login')
                                        : (type === 'seller' ? 'Open Your Studio' : 'Join the Gallery')}
                                </h2>
                                <p className="text-zinc-500 text-sm font-medium">
                                    {mode === 'login'
                                        ? 'Access your private collection dashboard.'
                                        : 'Select your identity and enter the world of art.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'register' && (
                                    <div className="flex flex-col items-center mb-8">
                                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Choose Your Identity</div>
                                        <div className="grid grid-cols-4 gap-3 bg-zinc-900/50 p-2 rounded-3xl border border-white/5">
                                            {AVATARS.map((url, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onClick={() => setAvatarUrl(url)}
                                                    className={`relative w-12 h-12 rounded-2xl overflow-hidden transition-all duration-300 ${avatarUrl === url
                                                        ? `ring-2 ring-offset-2 ring-offset-zinc-950 ${type === 'seller' ? 'ring-violet-500 scale-110' : 'ring-blue-500 scale-110'}`
                                                        : 'opacity-40 hover:opacity-100 hover:scale-105'
                                                        }`}
                                                >
                                                    <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className={`${mode === 'register' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}`}>
                                    {mode === 'register' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${type === 'seller' ? 'group-focus-within:text-violet-500 text-zinc-700' : 'group-focus-within:text-blue-500 text-zinc-700'}`} size={18} />
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    className={`w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none transition-all placeholder:text-zinc-700 ${type === 'seller' ? 'focus:border-violet-500/40' : 'focus:border-blue-500/40'}`}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${type === 'seller' ? 'group-focus-within:text-violet-500 text-zinc-700' : 'group-focus-within:text-blue-500 text-zinc-700'}`} size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none transition-all placeholder:text-zinc-700 ${type === 'seller' ? 'focus:border-violet-500/40' : 'focus:border-blue-500/40'}`}
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {mode === 'register' && (
                                        <>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Country</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500" size={18} />
                                                    <select
                                                        value={country}
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="IN">India</option>
                                                        <option value="US">USA</option>
                                                        <option value="GB">UK</option>
                                                        <option value="FR">France</option>
                                                        <option value="DE">Germany</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Mobile</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500" size={18} />
                                                    <input
                                                        type="tel"
                                                        value={mobile}
                                                        onChange={(e) => setMobile(e.target.value)}
                                                        className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/40 transition-all placeholder:text-zinc-700"
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Password</label>
                                        <div className="relative group">
                                            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${type === 'seller' ? 'group-focus-within:text-violet-500 text-zinc-700' : 'group-focus-within:text-blue-500 text-zinc-700'}`} size={18} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-12 py-3.5 text-white focus:outline-none transition-all placeholder:text-zinc-700 ${type === 'seller' ? 'focus:border-violet-500/40' : 'focus:border-blue-500/40'}`}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {mode === 'register' && (
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Confirm Identity</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-blue-500" size={18} />
                                                <input
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/40 transition-all placeholder:text-zinc-700"
                                                    placeholder="••••••••"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 mt-8 shadow-2xl active:scale-[0.98] group uppercase tracking-widest text-sm ${type === 'seller'
                                        ? 'bg-violet-500 hover:bg-violet-400 text-white shadow-violet-500/20'
                                        : 'bg-white hover:bg-zinc-200 text-black shadow-white/10'
                                        }`}
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Enter Studio' : 'Establish Residency'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center space-y-4">
                                <div className="text-sm font-medium text-zinc-500">
                                    {mode === 'login' ? (
                                        <p>
                                            New to the collective?{' '}
                                            <button onClick={toggleMode} className="text-white font-black hover:text-blue-400 transition-colors underline underline-offset-4">Join Now</button>
                                        </p>
                                    ) : (
                                        <p>
                                            Established collector?{' '}
                                            <button onClick={toggleMode} className={`font-black hover:underline underline-offset-4 transition-colors ${type === 'seller' ? 'text-violet-400 hover:text-violet-300' : 'text-white hover:text-blue-400'}`}>Verify Identity</button>
                                        </p>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-center">
                                    <button
                                        onClick={() => setType(type === 'customer' ? 'seller' : 'customer')}
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 ${type === 'seller' ? 'text-blue-400 hover:text-blue-300' : 'text-violet-400 hover:text-violet-300'}`}
                                    >
                                        {type === 'customer' ? 'Apply for Artist Residency' : 'Enter as Gallery Collector'}
                                        <ArrowRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
