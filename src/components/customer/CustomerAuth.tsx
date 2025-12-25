'use client';

import React, { useState } from 'react';
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
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [country, setCountry] = useState('IN');

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
        setShowPassword(false);
        setShowConfirmPassword(false);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Logic for authentication will go here later
        console.log(`${mode} submitted:`, { email, fullName, password, mobile, country });
        alert(`${mode.charAt(0).toUpperCase() + mode.slice(1)} functionality coming soon!`);
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
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            {mode === 'login' ? 'Email or Username' : 'Full Name'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                {mode === 'login' ? <Mail size={18} /> : <User size={18} />}
                            </div>
                            <input
                                type="text"
                                className={styles.input}
                                style={{ paddingLeft: '2.8rem' }}
                                placeholder={mode === 'login' ? 'john@example.com' : 'John Doe'}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {mode === 'register' && (
                        <>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        style={{ paddingLeft: '2.8rem' }}
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Country & Mobile (Optional)</label>
                                <div className={styles.phoneRow}>
                                    <div style={{ position: 'relative' }}>
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
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            style={{ paddingLeft: '2.8rem' }}
                                            placeholder="9876543210"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                className={styles.input}
                                style={{ paddingLeft: '2.8rem', paddingRight: '3rem' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.visibilityBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {mode === 'register' && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Confirm Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={styles.input}
                                    style={{ paddingLeft: '2.8rem', paddingRight: '3rem' }}
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.visibilityBtn}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn}>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
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
