'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Bell, Lock, Save, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        profile_image_url: '',
        notifications: {
            email: true,
            push: false,
            marketing: true
        }
    });

    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const fetchUserProfile = async () => {
        try {
            // 1. Try Supabase Auth first
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                const user = session.user;
                setFormData(prev => ({
                    ...prev,
                    fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
                    email: user.email || '',
                    profile_image_url: user.user_metadata?.profile_image_url || '',
                }));
                setProfilePreview(user.user_metadata?.profile_image_url || null);
                setLoading(false);
                return;
            }

            // 2. Try Custom Local Session
            const localUserString = localStorage.getItem('customer_user');
            if (localUserString) {
                const localUser = JSON.parse(localUserString);
                // Fetch latest data from DB to be sure
                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', localUser.id)
                    .single();

                if (data && !error) {
                    setFormData(prev => ({
                        ...prev,
                        fullName: data.full_name || '',
                        email: data.email || '',
                        profile_image_url: data.profile_image_url || '',
                    }));
                    setProfilePreview(data.profile_image_url || null);
                    setLoading(false);
                    return;
                }
            }

            // 3. No session found
            console.warn('No active session found, redirecting to login.');
            router.push('/login');
        } catch (error) {
            console.error('Error fetching user profile:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size exceeds 2MB limit.');
                return;
            }
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let currentProfileUrl = formData.profile_image_url;

            // 0. Upload Image if new one selected
            if (profileFile) {
                const fileExt = profileFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `customer-profiles/${fileName}`;

                // Upload to 'products' bucket as it likely already exists and has public access
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, profileFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                currentProfileUrl = publicUrl;
            }

            // 1. Try Supabase Auth Update
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { error } = await supabase.auth.updateUser({
                    data: {
                        full_name: formData.fullName,
                        name: formData.fullName,
                        profile_image_url: currentProfileUrl
                    }
                });
                if (error) throw error;
                setShowToast(true);
                return;
            }

            // 2. Try Custom DB Update
            const localUserString = localStorage.getItem('customer_user');
            if (localUserString) {
                const localUser = JSON.parse(localUserString);
                const { error } = await supabase
                    .from('customers')
                    .update({
                        full_name: formData.fullName,
                        profile_image_url: currentProfileUrl
                    })
                    .eq('id', localUser.id);

                if (error) throw error;

                // Update local storage too
                const updatedUser = {
                    ...localUser,
                    full_name: formData.fullName,
                    profile_image_url: currentProfileUrl
                };
                localStorage.setItem('customer_user', JSON.stringify(updatedUser));

                setFormData(prev => ({ ...prev, profile_image_url: currentProfileUrl }));
                setShowToast(true);
                return;
            }

            throw new Error('No active session. Please log in again.');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            const errMsg = error?.message || 'An unknown error occurred';
            alert("Failed to update profile: " + errMsg);
            if (errMsg.toLowerCase().includes('session')) {
                router.push('/login');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white pt-20 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-2"
                >
                    <h1 className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        Settings
                    </h1>
                    <p className="text-zinc-400">Manage your profile, preferences, and security settings.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Sidebar / Navigation */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1 space-y-4"
                    >
                        <nav className="flex flex-col gap-2 sticky top-28">
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium border border-white/5 shadow-lg">
                                <User size={18} /> Profile
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                                <Bell size={18} /> Notifications
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                                <Shield size={18} /> Security
                            </button>
                        </nav>
                    </motion.div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Profile Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <User className="text-blue-500" size={20} /> Public Profile
                                </h2>
                                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    Customer
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-6 mb-8 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className="relative w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                                    {profilePreview ? (
                                        <img
                                            src={profilePreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500 bg-gradient-to-br from-zinc-800 to-black">
                                            {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Profile Photo</h3>
                                    <p className="text-sm text-zinc-500 mb-2">Recommended 400x400px.</p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current?.click();
                                        }}
                                        className="text-xs font-bold text-blue-400 hover:text-blue-300"
                                    >
                                        Change Photo
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-zinc-400">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-zinc-400 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    Save Changes
                                </button>
                            </div>
                        </motion.section>

                        {/* Security Section (Compact) */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900/20 border border-white/5 rounded-3xl p-6 md:p-8"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-200">
                                        <Lock size={18} /> Password & Security
                                    </h2>
                                    <p className="text-sm text-zinc-500 mt-1">Manage your password and 2FA settings.</p>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        </motion.section>

                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <div className="fixed bottom-8 right-8 z-50">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={showToast ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`flex items-center gap-3 px-6 py-4 bg-zinc-900 border border-green-500/20 rounded-2xl shadow-2xl ${showToast ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                        <Save size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Profile Updated</h4>
                        <p className="text-xs text-zinc-400">Your changes have been saved successfully.</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
