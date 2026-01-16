'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Globe, Loader2, Sparkles, Palette } from 'lucide-react';

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
    const [step, setStep] = useState(1);
    const [type, setType] = useState<'customer' | 'seller'>(initialType);

    // Form State
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
            setMode('login');
            setStep(1);
            setEmail('');
            setPassword('');
        }
    }, [isOpen, initialType]);

    const nextStep = () => {
        if (step === 1) {
            if (!fullName || !email) return alert('Name and Email are required.');
            if (!email.includes('@')) return alert('Please enter a valid email.');
        }
        if (step === 2) {
            if (!mobile && type === 'seller') return alert('Artists must provide a contact number.');
        }
        setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setStep(1);
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

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                    redirectTo: `${window.location.origin}/auth/callback?type=${type}`,
                },
            });

            if (error) throw error;
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (mode === 'register') {
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

                alert(type === 'seller' ? 'Artist registration submitted! Review pending.' : 'Welcome! Account created.');
                setMode('login');
            } else {
                const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
                if (loginError) throw loginError;

                if (type === 'seller') {
                    const { data: seller } = await supabase.from('sellers').select('status').eq('id', data.user.id).single();
                    if (!seller) {
                        await supabase.auth.signOut();
                        throw new Error('Not registered as an Artist.');
                    }
                    onClose();
                    window.location.href = seller.status === 'approved' ? '/seller/dashboard' : '/seller/become-artist';
                } else {
                    const { data: customer } = await supabase.from('customers').select('id').eq('id', data.user.id).single();
                    if (!customer) {
                        await supabase.auth.signOut();
                        throw new Error('Customer profile not found.');
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

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${s === step ? 'w-8 ' + (type === 'seller' ? 'bg-violet-500' : 'bg-blue-500') :
                    s < step ? 'w-4 ' + (type === 'seller' ? 'bg-violet-500/40' : 'bg-blue-500/40') :
                        'w-4 bg-zinc-800'
                    }`} />
            ))}
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-3xl" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-white border border-zinc-100 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Backgrounds */}
                        <div className={`absolute -top-24 -left-24 w-64 h-64 blur-[100px] rounded-full opacity-20 ${type === 'seller' ? 'bg-violet-600' : 'bg-blue-600'}`} />
                        <div className={`absolute -bottom-24 -right-24 w-64 h-64 blur-[100px] rounded-full opacity-20 ${type === 'seller' ? 'bg-violet-600' : 'bg-blue-600'}`} />

                        <div className="p-8 md:p-10 relative z-10">
                            {/* Close Button */}
                            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors">
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase mb-4 ${type === 'seller' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                    {type === 'seller' ? <Palette size={12} /> : <Sparkles size={12} />}
                                    {type === 'seller' ? 'Artist Studio' : 'Collector Lounge'}
                                </div>
                                <h2 className="text-2xl font-black text-zinc-900 uppercase italic tracking-tighter">
                                    {mode === 'login' ? 'Authentication' : (step === 1 ? 'Identity' : step === 2 ? 'Origin' : 'Security')}
                                </h2>
                            </div>

                            {mode === 'register' && renderStepIndicator()}

                            {/* Social Login (Step 1 only) */}
                            {(mode === 'login' || (mode === 'register' && step === 1)) && (
                                <div className="space-y-4 mb-8">
                                    <button onClick={handleGoogleLogin} disabled={loading} className="w-full h-12 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 transition-all flex items-center justify-center gap-3 group shadow-sm hover:shadow-md">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Continue with Google</span>
                                    </button>
                                    <div className="relative flex items-center justify-center group pointer-events-none">
                                        <div className="absolute inset-0 flex items-center px-4"><div className="w-full border-t border-zinc-100"></div></div>
                                        <div className="relative px-4 bg-white text-[8px] font-black text-zinc-400 uppercase tracking-widest transition-colors group-hover:text-zinc-600">Or Entry via Email</div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${mode}-${step}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        {mode === 'login' ? (
                                            <>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email Identifier</label>
                                                    <div className="relative group">
                                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:${type === 'seller' ? 'text-violet-500' : 'text-blue-500'}`} size={16} />
                                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20" placeholder="Enter your email" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Key</label>
                                                    <div className="relative group">
                                                        <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:${type === 'seller' ? 'text-violet-500' : 'text-blue-500'}`} size={16} />
                                                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="••••••••" required />
                                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {step === 1 && (
                                                    <>
                                                        <div className="flex flex-col items-center mb-6">
                                                            <div className="grid grid-cols-4 gap-2.5 p-2 bg-zinc-900/30 rounded-3xl border border-white/5">
                                                                {AVATARS.map((url, i) => (
                                                                    <button key={i} type="button" onClick={() => setAvatarUrl(url)} className={`w-10 h-10 rounded-xl overflow-hidden transition-all ${avatarUrl === url ? `ring-2 ${type === 'seller' ? 'ring-violet-500 scale-110' : 'ring-blue-500 scale-110'}` : 'opacity-30 hover:opacity-100'}`}>
                                                                        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Full Name</label>
                                                            <div className="relative group">
                                                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:${type === 'seller' ? 'text-violet-500' : 'text-blue-500'}`} size={16} />
                                                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all" placeholder="Legal or Pen Name" required />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Email Address</label>
                                                            <div className="relative group">
                                                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:${type === 'seller' ? 'text-violet-500' : 'text-blue-500'}`} size={16} />
                                                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-white/20" placeholder="john@example.com" required />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {step === 2 && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Country</label>
                                                            <div className="relative group text-white">
                                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                                <select value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-zinc-900 focus:outline-none appearance-none cursor-pointer focus:border-blue-500">
                                                                    <option value="IN">India</option>
                                                                    <option value="US">USA</option>
                                                                    <option value="GB">UK</option>
                                                                    <option value="FR">France</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Personal Contact</label>
                                                            <div className="relative group">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none" placeholder="+91..." />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {step === 3 && (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Access Key</label>
                                                            <div className="relative group">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none" placeholder="••••••••" required />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Verify Key</label>
                                                            <div className="relative group">
                                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none" placeholder="••••••••" required />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex gap-3 pt-6">
                                    {mode === 'register' && step > 1 && (
                                        <button type="button" onClick={prevStep} className="flex-1 py-4 rounded-2xl border border-zinc-200 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-zinc-50 hover:text-zinc-900 transition-all">
                                            Return
                                        </button>
                                    )}

                                    {mode === 'register' && step < 3 ? (
                                        <button type="button" onClick={nextStep} className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 ${type === 'seller' ? 'bg-violet-600 text-white' : 'bg-zinc-900 text-white'}`}>
                                            Next Step <ArrowRight size={14} />
                                        </button>
                                    ) : (
                                        <button type="submit" disabled={loading} className={`flex-[2] py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all flex items-center justify-center gap-2 ${type === 'seller' ? 'bg-violet-600 text-white disabled:opacity-50' : 'bg-zinc-900 text-white disabled:opacity-50'}`}>
                                            {loading ? <Loader2 className="animate-spin" size={14} /> : (mode === 'login' ? 'Enter Gallery' : 'Create Profile')}
                                        </button>
                                    )}
                                </div>
                            </form>

                            <div className="mt-8 text-center space-y-6">
                                <div className="text-[10px] font-black text-zinc-600 hover:text-zinc-500 transition-colors cursor-default">
                                    {mode === 'login' ? (
                                        <p>NEW COLLECTOR? <button onClick={toggleMode} className="text-zinc-900 hover:text-blue-600 hover:underline transition-all underline-offset-4 decoration-zinc-200 font-bold">JOIN NOW</button></p>
                                    ) : (
                                        <p>ALREADY ENROLLED? <button onClick={toggleMode} className="text-zinc-900 hover:text-blue-600 hover:underline transition-all underline-offset-4 decoration-zinc-200 font-bold">LOGIN</button></p>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-zinc-100">
                                    <button onClick={() => setType(type === 'customer' ? 'seller' : 'customer')} className={`text-[8px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2 mx-auto ${type === 'seller' ? 'text-blue-500 hover:text-blue-400' : 'text-violet-500 hover:text-violet-400'}`}>
                                        Switch to {type === 'customer' ? 'Artist Studio' : 'Collector Lounge'} →
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
