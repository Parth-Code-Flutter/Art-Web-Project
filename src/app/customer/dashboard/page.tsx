import React from 'react';
import DashboardHeader from '@/components/customer/DashboardHeader';
import styles from './dashboard.module.css';

export default function CustomerDashboard() {
    return (
        <main className={styles.container}>
            <DashboardHeader />

            <div className={styles.glassCard}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Customer Dashboard</h1>
                    <p className={styles.subtitle}>Welcome to your private art gallery experience.</p>
                </header>

                <div className={styles.content}>
                    <p>This is where you'll be able to view your collection, track orders, and explore new masterpieces.</p>
                </div>
            </div>
        </main>
    );
}
