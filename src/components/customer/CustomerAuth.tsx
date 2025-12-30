'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Globe, Loader2, Sparkles } from 'lucide-react';

interface CustomerAuthProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CustomerAuth({ isOpen, onClose }: CustomerAuthProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('IN');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                // 1. Sign up with Supabase Auth (Creates user in auth.users)
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name: fullName,
                            phone: mobile,
                        }
                    }
                });

                if (authError) throw authError;

                // 2. Mirror to public.customers table (using UPSERT to handle legacy emails)
                if (authData.user) {
                    const { error: dbError } = await supabase
                        .from('customers')
                        .upsert({
                            id: authData.user.id,
                            full_name: fullName,
                            email,
                            mobile: mobile || null,
                            country
                        }, { onConflict: 'email' });

                    if (dbError) {
                        console.error('Profile sync error:', dbError);
                    }
                }

                alert('Account created! IMPORTANT: If you cannot login immediately, check your inbox for a verification email OR disable "Confirm Email" in your Supabase Auth Settings.');
                setMode('login');
            } else {
                // 1. Sign in with Supabase Auth
                const { data, error: loginError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (loginError) throw loginError;

                // Success
                onClose();
                // Use window.location.href for a full refresh to ensure middleware picks up the session
                window.location.href = '/customer/dashboard';
            }
        } catch (err: any) {
            console.error('Authentication error:', err.message || err);

            let friendlyMessage = err.message || 'Authentication failed.';
            if (err.message === 'Invalid login credentials') {
                friendlyMessage = 'Invalid email or password. If you haven\'t registered since the security update, please click "Register now" below. Also, check if email verification is required in your Supabase settings.';
            }

            alert(friendlyMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12">
                            {/* Header */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold tracking-wider uppercase mb-4">
                                    <Sparkles size={14} /> {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-white mb-2">
                                    {mode === 'login' ? 'Signed in for Art' : 'Join the Elite Gallery'}
                                </h2>
                                <p className="text-zinc-400 text-sm">
                                    {mode === 'login'
                                        ? 'Access your curated collection and private bids.'
                                        : 'Experience art ownership like never before.'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {mode === 'register' && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                            placeholder="collector@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {mode === 'register' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Country</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <select
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                                                >
                                                    <option value="IN">India</option>
                                                    <option value="US">USA</option>
                                                    <option value="GB">UK</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Mobile</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                                <input
                                                    type="tel"
                                                    value={mobile}
                                                    onChange={(e) => setMobile(e.target.value)}
                                                    className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                                    placeholder="987..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
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
                                        <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-black/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 shadow-xl shadow-white/5 group"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Enter Gallery' : 'Create My Account'}
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm text-zinc-500">
                                {mode === 'login' ? (
                                    <p>
                                        Don't have an account?{' '}
                                        <button onClick={toggleMode} className="text-white font-bold hover:underline">Register now</button>
                                    </p>
                                ) : (
                                    <p>
                                        Already a member?{' '}
                                        <button onClick={toggleMode} className="text-white font-bold hover:underline">Sign in here</button>
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
