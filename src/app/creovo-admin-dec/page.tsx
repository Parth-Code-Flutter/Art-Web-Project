'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Palette, ShieldCheck, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CreovoAdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            console.log('Admin login successful');
            // Full reload to ensure middleware picks up the new session cookies
            window.location.href = '/admin';
        } catch (err: any) {
            console.error('Admin login error:', err.message || err);
            alert(err.message || 'Invalid Admin Credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6 font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#3b82f622_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[420px]">
                {/* Logo Branding */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl mb-4 group hover:scale-105 transition-transform duration-500">
                        <Palette size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-widest uppercase">Creovo</h1>
                    <div className="h-px w-12 bg-blue-500 mt-2" />
                </div>

                {/* Login Card */}
                <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <ShieldCheck size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Vault Access</h2>
                        </div>

                        <form className="space-y-6" onSubmit={handleAdminLogin}>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Commander Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-sm"
                                        placeholder="admin@creovo.art"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Security Key</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none text-sm"
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full relative overflow-hidden group/btn bg-white text-black font-black py-4.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/5 mt-4"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <span className="relative flex items-center justify-center gap-2">
                                    {isLoading ? 'Decrypting...' : 'Initialize Access'}
                                </span>
                            </button>
                        </form>
                    </div>

                    {/* Footer decoration */}
                    <div className="mt-10 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-bold tracking-widest uppercase opacity-50">
                        <Lock size={10} /> Fully Encrypted Protocol 256-AES
                    </div>
                </div>
            </div>
        </main>
    );
}
