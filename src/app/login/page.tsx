'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';

/**
 * Login Page Component
 * 
 * Provides a clean, premium interface for users to select their role.
 * Built with modular CSS and React client-side rendering.
 */
export default function LoginPage() {
    const router = useRouter();
    const [view, setView] = React.useState<'roles' | 'admin'>('roles');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Static credential check
        // In a real app, this would verify against Supabase Auth
        const staticEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@example.com';
        const staticPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'password123';

        if (email === staticEmail && password === staticPassword) {
            router.push('/admin');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.loginBox}>
                <header>
                    <h1 className={styles.title}>Art Gallery</h1>
                    <p className={styles.subtitle}>
                        {view === 'roles' ? 'Welcome back. Please select your role.' : 'Admin Access Required'}
                    </p>
                </header>

                {view === 'roles' ? (
                    <nav className={styles.buttonGroup}>
                        <button
                            className={`${styles.button} ${styles.adminBtn}`}
                            onClick={() => setView('admin')}
                        >
                            Admin Portal
                        </button>

                        <button
                            className={`${styles.button} ${styles.customerBtn}`}
                            onClick={() => console.log('Customer Login Initiated')}
                        >
                            Explore Gallery
                        </button>
                    </nav>
                ) : (
                    <form className={styles.form} onSubmit={handleAdminLogin}>
                        <input
                            type="email"
                            placeholder="Admin Email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className={`${styles.button} ${styles.adminBtn}`}>
                            Login
                        </button>
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={() => setView('roles')}
                        >
                            Back to selection
                        </button>
                    </form>
                )}

                <footer style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                    By continuing, you agree to our Terms of Service.
                </footer>
            </div>
        </main>
    );
}
