'use client';

import React from 'react';

/**
 * Admin Home Page
 * 
 * Simple home page for the admin portal as per initial user instructions.
 */
export default function AdminHomePage() {
    return (
        <main style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #1a1a1a, #0a0a0a)',
            color: '#fff',
            fontFamily: 'var(--font-heading)'
        }}>
            <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700 }}>Admin Portal</h1>
                <p style={{ color: '#a1a1a1', marginTop: '1rem' }}>Welcome to the management dashboard.</p>
            </div>
        </main>
    );
}
