'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Sparkles,
    ArrowRight,
    Mail,
    Lock,
    User,
    Phone,
    Globe,
    Loader2,
    CheckCircle2,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Curated Avatars for "Cool" Identity Selection
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

export default function AuthPage() {
    const router = useRouter();

    // UI State
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [role, setRole] = useState<'customer' | 'seller'>('customer');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    // Form Data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('IN');
    const [avatarUrl, setAvatarUrl] = useState(AVATARS[0]);

    // Validation & Progress
    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    queryParams: { access_type: 'offline', prompt: 'consent' },
                    redirectTo: `${window.location.origin}/auth/callback?type=${role}`,
                },
            });
            if (error) throw error;
        } catch (error: any) {
            alert(error.message);
            setLoading(false);
        }
    };

    const handleRegisterStep = ((direction: 'next' | 'prev') => {
        if (direction === 'prev') {
            setStep(prev => Math.max(1, prev - 1));
            return;
        }

        // Validation Logic
        if (step === 1) {
            if (!fullName) return alert('Please tell us your name.');
            if (!email || !email.includes('@')) return alert('A valid email is required.');
        }
        if (step === 2) {
            // Optional checks for location/mobile
            if (role === 'seller' && !mobile) return alert('Artists must provide a contact.');
        }

        setStep(prev => prev + 1);
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // Role Check
                const table = role === 'seller' ? 'sellers' : 'customers';
                const { data: profile } = await supabase.from(table).select('id, status').eq('id', data.user.id).maybeSingle();

                if (!profile) {
                    await supabase.auth.signOut();
                    throw new Error(`No ${role} profile found.`);
                }

                if (role === 'seller' && profile.status !== 'approved') {
                    // Redirect to waitlist or status page
                    router.push('/seller/become-artist');
                    return;
                }

                router.push(role === 'seller' ? '/seller/dashboard' : '/customer/dashboard');

            } else {
                // Register Logic
                if (password !== confirmPassword) throw new Error("Passwords must match.");
                if (password.length < 6) throw new Error("Password too short.");

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: fullName,
                            phone: mobile,
                            role,
                            country, // Added for Trigger/Meta access
                            avatar_url: avatarUrl
                        }
                    }
                });

                if (authError) throw authError;

                // HANDLE EMAIL VERIFICATION FLOW
                if (authData.user && !authData.session) {
                    alert('Registration successful! Please check your email inbox to verify your account.');
                    setMode('login');
                    setStep(1);
                    return; // Stop here. The SQL Trigger (if setup) or post-verification logic will handle profile creation.
                }

                if (!authData.user) throw new Error("Registration failed.");

                // Client-side DB Insert (Only works if Session is active / Email Verification OFF)
                const table = role === 'seller' ? 'sellers' : 'customers';
                const payload = {
                    id: authData.user.id,
                    full_name: fullName,
                    email,
                    mobile: mobile || null,
                    avatar_url: avatarUrl || null,
                    ...(role === 'customer' ? { country } : { status: 'pending' })
                };

                const { error: dbError } = await supabase.from(table).upsert(payload);
                if (dbError) throw dbError;

                alert(role === 'seller' ? 'Application submitted!' : 'Welcome to ArtGallery!');
                setMode('login');
                setStep(1);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen bg-white font-sans text-zinc-900 selection:bg-blue-100">
            {/* Left Content - The "Vibe" */}
            <div className="hidden lg:flex w-1/2 relative bg-zinc-900 flex-col justify-between p-16 overflow-hidden">
                {/* 1. Dynamic CSS Gradient Mesh (Always Visible) */}
                <div className="absolute inset-0 bg-[#09090b]">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-blue-600/10 blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] rounded-full bg-purple-600/10 blur-[120px]" />
                    <div className="absolute top-[40%] left-[40%] translate-x-[-50%] translate-y-[-50%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[100px]" />
                </div>

                {/* 2. Texture Overlay (Safe Background) */}
                <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay transition-opacity duration-1000"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2000&auto=format&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />

                {/* Content: Header */}
                <div className="relative z-10 w-fit">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 mb-6 shadow-2xl">
                        <Palette size={24} />
                    </div>
                    <Link href="/" className="text-3xl font-hero font-black text-white tracking-tight drop-shadow-xl">ArtGallery</Link>
                </div>

                {/* Content: Floating Featured Card (Fills the Void) */}
                <div className="relative z-10 flex-1 flex items-center justify-center py-8">
                    <div className="w-full max-w-[320px] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-3xl transform -rotate-2 hover:rotate-0 transition-all duration-500 hover:bg-white/10 shadow-2xl group cursor-default">
                        <div className="aspect-[4/5] rounded-2xl bg-zinc-800 overflow-hidden mb-4 relative shadow-inner">
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800&auto=format&fit=crop)' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white text-xs font-bold">
                                Featured Collection
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <h3 className="text-white font-bold text-sm tracking-wide">Chromatic Dreams</h3>
                                <p className="text-zinc-400 text-[10px] font-medium uppercase tracking-wider mt-0.5">Abstract Series</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content: Bottom Text */}
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-hero font-black text-white leading-tight mb-4 drop-shadow-lg">
                        Curate your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Digital Legacy</span>
                    </h2>
                    <p className="text-zinc-400 max-w-md font-medium leading-relaxed text-sm">
                        Join 24,000+ collectors discovering visionary masterpieces.
                    </p>
                </div>
            </div>

            {/* Right Content - The "Interaction" */}
            <div className="w-full lg:w-1/2 flex flex-col relative">
                {/* Mobile Header */}
                <div className="lg:hidden p-6 pb-0 flex items-center justify-between">
                    <Link href="/" className="text-xl font-hero font-black tracking-tight">ArtGallery</Link>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 md:px-20 xl:px-32 py-12">
                    <div className="max-w-[440px] w-full mx-auto space-y-10">

                        {/* Role Toggle Switch & Clarity */}
                        <div className="flex justify-end mb-2">
                            <div className="flex flex-col items-end gap-1">
                                <button
                                    onClick={() => setRole(role === 'customer' ? 'seller' : 'customer')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[11px] font-bold uppercase tracking-widest ${role === 'seller'
                                        ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                                        : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900'
                                        }`}
                                >
                                    {role === 'customer' ? (
                                        <>
                                            <span>Are you an Artist?</span>
                                            <Palette size={14} />
                                        </>
                                    ) : (
                                        <>
                                            <ArrowRight size={14} className="rotate-180" />
                                            <span>Return to Collector</span>
                                        </>
                                    )}
                                </button>
                                <span className="text-[9px] text-zinc-400 font-medium tracking-wide pr-2">
                                    {role === 'customer' ? 'Sell your work on ArtGallery' : 'Buy and collect art'}
                                </span>
                            </div>
                        </div>

                        {/* Dynamic Headings based on Role */}
                        <div className="space-y-2 text-center lg:text-left">
                            <h1 className="text-4xl font-hero font-black tracking-tighter text-zinc-900">
                                {mode === 'login'
                                    ? (role === 'seller' ? 'Artist Studio' : 'Welcome Back')
                                    : (role === 'seller' ? 'Join as Artist' : 'Join the Gallery')}
                            </h1>
                            <p className="text-zinc-500 font-medium">
                                {role === 'seller'
                                    ? (mode === 'login' ? 'Manage your portfolio and track your sales.' : 'Apply to showcase your work to the world.')
                                    : (mode === 'login' ? 'Enter your credentials to access your collection.' : 'Begin your journey into the world of creative art.')}
                            </p>
                        </div>

                        {/* Auth Mode Tabs */}
                        <div className="flex p-1 bg-zinc-100/80 rounded-2xl w-full">
                            {['login', 'register'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m as any); setStep(1); }}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === m ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                                >
                                    {m === 'login' ? 'Sign In' : 'Register'}
                                </button>
                            ))}
                        </div>

                        {/* Form Area */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode + step}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-5"
                                >
                                    {mode === 'login' ? (
                                        <>
                                            <div className="group space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-600" size={18} />
                                                    <input
                                                        type="email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-300"
                                                        placeholder="name@example.com"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="group space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-600" size={18} />
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-12 py-4 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-300"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* REGISTER FLOW */
                                        <>
                                            {step === 1 && (
                                                <div className="space-y-6">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Choose your Avatar</span>
                                                        <div className="flex gap-2 p-2 bg-zinc-50 border border-zinc-100 rounded-3xl overflow-x-auto max-w-full scrollbar-hide">
                                                            {AVATARS.map((url) => (
                                                                <button key={url} type="button" onClick={() => setAvatarUrl(url)} className={`shrink-0 w-12 h-12 rounded-2xl overflow-hidden transition-all ${avatarUrl === url ? 'ring-2 ring-blue-500 scale-105' : 'opacity-40 hover:opacity-80'}`}>
                                                                    <img src={url} className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div className="relative">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300" placeholder="Display Name" />
                                                        </div>
                                                        <div className="relative">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300" placeholder="Email Address" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {step === 2 && (
                                                <div className="space-y-5">
                                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 text-blue-700">
                                                        <Sparkles size={20} className="shrink-0" />
                                                        <p className="text-xs font-medium leading-relaxed">ArtGallery is global. Telling us where you are helps us curate relevant works.</p>
                                                    </div>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                        <select value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:border-blue-500 appearance-none cursor-pointer">
                                                            <option value="IN">India</option>
                                                            <option value="US">United States</option>
                                                            <option value="GB">United Kingdom</option>
                                                            <option value="FR">France</option>
                                                        </select>
                                                    </div>
                                                    <div className="relative">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                        <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-4 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300" placeholder="Mobile (Optional)" />
                                                    </div>
                                                </div>
                                            )}

                                            {step === 3 && (
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                        <input
                                                            type={showRegisterPassword ? "text" : "password"}
                                                            value={password}
                                                            onChange={e => setPassword(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-12 py-4 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                            placeholder="Create Password"
                                                        />
                                                        <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                                            {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                        </button>
                                                    </div>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                                        <input
                                                            type={showRegisterPassword ? "text" : "password"}
                                                            value={confirmPassword}
                                                            onChange={e => setConfirmPassword(e.target.value)}
                                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-12 py-4 font-medium outline-none focus:border-blue-500 transition-all placeholder:text-zinc-300"
                                                            placeholder="Confirm Password"
                                                        />
                                                        {/* Optional: Second eye or shared control. Shared is cleaner UI for setup. */}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Action Buttons */}
                            <div className="pt-4">
                                {mode === 'register' && step < 3 ? (
                                    <div className="flex gap-3">
                                        {step > 1 && (
                                            <button type="button" onClick={() => handleRegisterStep('prev')} className="px-6 py-4 rounded-2xl border border-zinc-200 font-bold hover:bg-zinc-50 transition-colors">
                                                Back
                                            </button>
                                        )}
                                        <button type="button" onClick={() => handleRegisterStep('next')} className="flex-1 bg-zinc-900 text-white font-button font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                            Next Step <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full text-white font-button font-black uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-zinc-900/10 disabled:opacity-50 ${role === 'seller' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-zinc-900 hover:bg-zinc-800'
                                            }`}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? (role === 'seller' ? 'Enter Studio' : 'Access Gallery') : (role === 'seller' ? 'Submit Application' : 'Create Account'))}
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Social Buttons */}
                        {(mode === 'login' || step === 1) && (
                            <div className="space-y-6">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute inset-x-0 h-px bg-zinc-100" />
                                    <span className="relative bg-white px-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Or Continue With</span>
                                </div>
                                <button
                                    onClick={handleGoogleLogin}
                                    type="button"
                                    className="w-full py-3.5 border border-zinc-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all group"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">Google Account</span>
                                </button>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                By continuing, you agree to our <Link href="#" className="underline">Terms</Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
