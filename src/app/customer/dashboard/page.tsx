import React from 'react';
import DashboardHeader from '@/components/customer/DashboardHeader';
import BentoHero from '@/components/customer/BentoHero';
import styles from './dashboard.module.css';

export default function CustomerDashboard() {
    return (
        <main className={styles.container}>
            <DashboardHeader />

            <div className={styles.contentWrapper}>
                <BentoHero />
            </div>
        </main>
    );
}
