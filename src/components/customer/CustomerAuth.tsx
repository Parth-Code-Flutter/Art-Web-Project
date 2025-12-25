'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        // Reset fields when toggling
        setEmail('');
        setUsername('');
        setPassword('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for authentication will go here later
        console.log(`${mode} submitted:`, { email, username, password });
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {mode === 'register' && (
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
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                className={styles.input}
                                style={{ paddingLeft: '2.8rem' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
