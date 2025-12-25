'use client';

import React from 'react';
import styles from './login.module.css';

/**
 * Login Page Component
 * 
 * Provides a clean, premium interface for users to select their role.
 * Built with modular CSS and React client-side rendering.
 */
export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <header>
          <h1 className={styles.title}>Art Gallery</h1>
          <p className={styles.subtitle}>Welcome back. Please select your role to continue.</p>
        </header>

        <nav className={styles.buttonGroup}>
          {/* Admin Access Button */}
          <button 
            className={`${styles.button} ${styles.adminBtn}`}
            onClick={() => console.log('Admin Login Initiated')}
          >
            Admin Portal
          </button>

          {/* Customer Access Button */}
          <button 
            className={`${styles.button} ${styles.customerBtn}`}
            onClick={() => console.log('Customer Login Initiated')}
          >
            Explore Gallery
          </button>
        </nav>

        <footer style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--secondary)' }}>
          By continuing, you agree to our Terms of Service.
        </footer>
      </div>
    </main>
  );
}
