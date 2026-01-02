'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Shield, Bell, Lock, Save, Loader2, Phone,
    Globe, LayoutGrid, LogOut, ChevronRight, Camera,
    CreditCard, CheckCircle2, Sliders, ArrowLeft, CameraIcon
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
    'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop',
];

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'security'>('profile');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        country: 'IN',
        avatarUrl: AVATARS[0],
        role: 'customer'
    });

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                setFormData(prev => ({
                    ...prev,
                    fullName: profile.full_name || '',
                    email: profile.email || '',
                    mobile: profile.mobile || '',
                    country: profile.country || 'IN',
                    avatarUrl: profile.avatar_url || profile.profile_image_url || AVATARS[0],
                    role: profile.role || 'customer'
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Session lost');

            // Update Profiles
            await supabase.from('profiles').update({
                full_name: formData.fullName,
                mobile: formData.mobile,
                avatar_url: formData.avatarUrl,
                updated_at: new Date().toISOString()
            }).eq('id', session.user.id);

            // Update Role Table
            const tableName = formData.role === 'seller' ? 'sellers' : 'customers';
            await supabase.from(tableName).update({
                full_name: formData.fullName,
                mobile: formData.mobile,
                avatar_url: formData.avatarUrl,
                ...(formData.role === 'customer' && { country: formData.country })
            }).eq('id', session.user.id);

            // Update Auth
            await supabase.auth.updateUser({
                data: { full_name: formData.fullName, avatar_url: formData.avatarUrl }
            });

            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
        </div>
    );

    return (
        <main className="min-h-screen bg-[#080808] text-zinc-400 font-sans selection:bg-white/10 pt-24 pb-20">
            {/* Global Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">

                {/* Compact Header */}
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-2 mr-2 rounded-full bg-zinc-900 border border-white/5 text-zinc-500 hover:text-white transition-all shadow-inner"
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Account Hub</h1>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">System Preferences</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/50 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Live Services</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Navigation Sidebar (Vertical Tabs) */}
                    <div className="lg:col-span-4 space-y-6">
                        <nav className="p-2 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl">
                            <ul className="space-y-1">
                                {[
                                    { id: 'profile', label: 'Identity', icon: User },
                                    { id: 'billing', label: 'Wallet', icon: CreditCard },
                                    { id: 'security', label: 'Encryption', icon: Shield },
                                ].map((tab) => (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === tab.id
                                                    ? 'bg-zinc-800 text-white shadow-lg'
                                                    : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <tab.icon size={16} className={activeTab === tab.id ? 'text-white' : 'text-zinc-600'} />
                                                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
                                            </div>
                                            {activeTab === tab.id && (
                                                <motion.div layoutId="tab-dot" className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Quick Actions Card */}
                        <div className="p-6 bg-zinc-900/20 border border-white/5 rounded-3xl space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Shortcuts</h4>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => router.push(formData.role === 'seller' ? '/seller/dashboard' : '/customer/dashboard')}
                                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors p-2"
                                >
                                    <LayoutGrid size={14} /> Dashboard
                                </button>
                                <button
                                    onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}
                                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-400 transition-colors p-2"
                                >
                                    <LogOut size={14} /> Kill Session
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Settings Panel */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-zinc-900/10 border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl overflow-hidden relative"
                            >
                                {/* Static Background Decoration */}
                                <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12 pointer-events-none">
                                    <Sliders size={200} />
                                </div>

                                {activeTab === 'profile' && (
                                    <div className="space-y-10 relative z-10">

                                        {/* Avatar Refinement */}
                                        <div className="flex items-center gap-8">
                                            <div className="relative group flex-shrink-0">
                                                <div className="w-24 h-24 rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                                    <img src={formData.avatarUrl} alt="User" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-xl p-2 shadow-xl border-2 border-[#080808]">
                                                    <CameraIcon size={14} className="text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-white text-lg font-black tracking-tight italic uppercase">{formData.fullName || 'Collector'}</h3>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">Verified Member • Level 1</p>
                                                <div className="flex gap-2 mt-4">
                                                    {AVATARS.slice(0, 4).map((url, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setFormData({ ...formData, avatarUrl: url })}
                                                            className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${formData.avatarUrl === url ? 'border-blue-500 scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                        >
                                                            <img src={url} alt="Av" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form Fields - Sleek Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Legal Designation</label>
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                                    <input
                                                        type="text"
                                                        value={formData.fullName}
                                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-12 py-3.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/40 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Digital Link (Email)</label>
                                                <div className="relative group opacity-50">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800" size={14} />
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="w-full bg-transparent border border-white/5 rounded-2xl px-12 py-3.5 text-xs text-zinc-600 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Comms Protocol</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                                    <input
                                                        type="tel"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-12 py-3.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/40 transition-all font-medium"
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 ml-1">Geo Coordinate</label>
                                                <div className="relative group">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                                    <select
                                                        value={formData.country}
                                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-12 py-3.5 text-xs text-zinc-300 focus:outline-none appearance-none cursor-pointer"
                                                    >
                                                        <option value="IN">India</option>
                                                        <option value="US">USA</option>
                                                        <option value="GB">UK</option>
                                                        <option value="FR">France</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Control Bar */}
                                        <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-4">
                                            <p className="text-[9px] font-medium text-zinc-600 max-w-[180px]">All data is encrypted before synchronization with the main node.</p>
                                            <button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="px-8 py-3.5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                            >
                                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                Save Identity
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'billing' && (
                                    <div className="space-y-8 relative z-10 text-center py-6">
                                        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <CreditCard size={28} className="text-blue-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-xl font-black tracking-tight uppercase italic mb-2">Fiscal Assets</h3>
                                            <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-10">Manage your connected wallets and transaction history log.</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                            <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Spent</p>
                                                <p className="text-lg font-black text-white italic">$0.00</p>
                                            </div>
                                            <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                                                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Items</p>
                                                <p className="text-lg font-black text-white italic">0</p>
                                            </div>
                                        </div>
                                        <button className="px-8 py-3.5 border border-white/10 text-white font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-white hover:text-black transition-all">
                                            Setup Billing
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'security' && (
                                    <div className="space-y-8 relative z-10 text-center py-6">
                                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Shield size={28} className="text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-white text-xl font-black tracking-tight uppercase italic mb-2">Vault Access</h3>
                                            <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-10">System encryption and session authentication controls.</p>
                                        </div>
                                        <div className="space-y-4 max-w-xs mx-auto">
                                            <button className="w-full px-8 py-3.5 bg-white text-black font-black uppercase tracking-widest text-[9px] rounded-2xl hover:bg-zinc-200 transition-all">
                                                Update Auth Key
                                            </button>
                                            <button className="w-full px-8 py-3.5 border border-white/10 text-zinc-500 font-black uppercase tracking-widest text-[9px] rounded-2xl hover:text-white transition-all">
                                                Audit History
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Subtle Success Toast */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]"
                    >
                        <div className="bg-white text-black px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                            <CheckCircle2 size={16} className="text-green-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profile Synchronized</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
