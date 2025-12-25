'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Globe } from 'lucide-react';
import styles from './CustomerAuth.module.css';

interface CustomerAuthProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * CustomerAuth Component
 * 
 * Provides a premium Login/Registration interface for customers.
 * Theme: White (Primary) & Light Blue (Secondary).
 */
export default function CustomerAuth({ isOpen, onClose }: CustomerAuthProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('IN');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!isOpen) return null;

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        // Reset fields when toggling
        setEmail('');
        setFullName('');
        setPassword('');
        setConfirmPassword('');
        setMobile('');
        setProfileImage(null);
        setProfilePreview(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Image size exceeds 2MB limit.');
                return;
            }
            setProfileImage(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const validateForm = () => {
        if (mode === 'register') {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return false;
            }
            if (mobile && !/^\d{10,15}$/.test(mobile)) {
                alert('Please enter a valid mobile number (10-15 digits).');
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
                // REGISTRATION LOGIC
                let profileImageUrl = null;

                // 1. Upload Profile Image if selected
                if (profileImage) {
                    const fileExt = profileImage.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                    const filePath = `customer-profiles/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(filePath, profileImage);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('products')
                        .getPublicUrl(filePath);

                    profileImageUrl = publicUrl;
                }

                const { error: regError } = await supabase
                    .from('customers')
                    .insert([{
                        full_name: fullName,
                        email,
                        password,
                        mobile: mobile || null,
                        country,
                        profile_image_url: profileImageUrl
                    }]);

                if (regError) {
                    if (regError.message.includes('unique constraint')) {
                        alert('Email or Mobile number already exists!');
                    } else {
                        throw regError;
                    }
                    return;
                }

                alert('Account created successfully! Please sign in.');
                setMode('login');
            } else {
                // LOGIN LOGIC
                const { data, error: loginError } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('email', fullName)
                    .eq('password', password)
                    .single();

                if (loginError || !data) {
                    alert('Invalid email or password.');
                    return;
                }

                // Navigate to Customer Dashboard
                router.push('/customer/dashboard');
            }
        } catch (err: any) {
            console.error('Auth operation failed:', err);
            alert(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>

                <div className={styles.header}>
                    <h1 className={styles.title}>
                        {mode === 'login' ? 'Welcome Back' : 'Join the Gallery'}
                    </h1>
                    <p className={styles.subtitle}>
                        {mode === 'login'
                            ? 'Sign in to explore your curated art collection.'
                            : 'Create an account to start your artistic journey.'}
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className={styles.profileUpload}>
                            <div className={styles.profilePreview}>
                                {profilePreview ? (
                                    <img src={profilePreview} alt="Profile Preview" />
                                ) : (
                                    <User size={48} />
                                )}
                            </div>
                            <input
                                type="file"
                                id="profileImg"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <button
                                type="button"
                                className={styles.uploadTrigger}
                                onClick={() => document.getElementById('profileImg')?.click()}
                            >
                                {profilePreview ? 'Change Photo' : 'Upload Photo (Optional)'}
                            </button>
                        </div>
                    )}

                    <div className={styles.inputGroup} style={{ '--idx': 1 } as React.CSSProperties}>
                        <label className={styles.label}>
                            {mode === 'login' ? 'Email or Username' : 'Full Name'}
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder={mode === 'login' ? 'john@example.com' : 'John Doe'}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                            <div className={styles.icon}>
                                {mode === 'login' ? <Mail size={18} /> : <User size={18} />}
                            </div>
                        </div>
                    </div>

                    {mode === 'register' && (
                        <>
                            <div className={styles.inputGroup} style={{ '--idx': 2 } as React.CSSProperties}>
                                <label className={styles.label}>Email Address</label>
                                <div className={styles.inputWrapper}>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className={styles.icon}>
                                        <Mail size={18} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.inputGroup} style={{ '--idx': 3 } as React.CSSProperties}>
                                <label className={styles.label}>Country & Mobile (Optional)</label>
                                <div className={styles.phoneRow}>
                                    <div className={styles.inputWrapper}>
                                        <select
                                            className={styles.select}
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option value="IN">India (+91)</option>
                                            <option value="US">USA (+1)</option>
                                            <option value="GB">UK (+44)</option>
                                            <option value="AE">UAE (+971)</option>
                                            <option value="AU">AUS (+61)</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            placeholder="9876543210"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                        <div className={styles.icon}>
                                            <Phone size={18} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.inputGroup} style={{ '--idx': 4 } as React.CSSProperties}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.input}
                                style={{ paddingRight: '3.5rem' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className={styles.icon}>
                                <Lock size={18} />
                            </div>
                            <button
                                type="button"
                                className={styles.visibilityBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {mode === 'register' && (
                        <div className={styles.inputGroup} style={{ '--idx': 5 } as React.CSSProperties}>
                            <label className={styles.label}>Confirm Password</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={styles.input}
                                    style={{ paddingRight: '3.5rem' }}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <div className={styles.icon}>
                                    <Lock size={18} />
                                </div>
                                <button
                                    type="button"
                                    className={styles.visibilityBtn}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        {!loading && <ArrowRight size={22} />}
                    </button>
                </form>

                <div className={styles.footer}>
                    {mode === 'login' ? (
                        <>
                            New to ArtGallery?
                            <button className={styles.toggleBtn} onClick={toggleMode}>
                                Create an account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <button className={styles.toggleBtn} onClick={toggleMode}>
                                Sign in
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
