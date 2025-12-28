import React from 'react';
import BentoHero from '@/components/customer/BentoHero';
import styles from './dashboard.module.css';

export default function CustomerDashboard() {
    return (
        <main className={styles.container}>

            <div className={styles.contentWrapper}>
                <BentoHero />
            </div>
        </main>
    );
}
