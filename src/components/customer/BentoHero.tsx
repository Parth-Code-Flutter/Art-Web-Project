'use client';

import React from 'react';
import { ArrowRight, Sparkles, ShoppingBag, LayoutGrid, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './BentoHero.module.css';

export default function BentoHero() {
    return (
        <section className={styles.container}>
            {/* 1. Dynamic Greeting */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${styles.bentoItem} ${styles.greeting}`}
            >
                <div className={styles.badge}>
                    <Sparkles size={14} style={{ marginRight: '0.4rem' }} /> Exclusive Early Access
                </div>
                <h1 className={styles.title}>
                    Good Morning, <br />
                    <span className={styles.userName}>Alexandra.</span>
                </h1>
                <p className={styles.subtitle}>
                    Explore the latest additions to your curated collection.
                </p>
            </motion.div>

            {/* 2. Featured Artwork Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`${styles.bentoItem} ${styles.featured}`}
            >
                <div>
                    <div className={styles.badge}>Featured Masterpiece</div>
                    <h2 className={styles.cardTitle}>Aurora II</h2>
                    <p style={{ color: '#64748b' }}>By Elara Vance</p>
                </div>

                <div className={styles.imageOverlay}>
                    {/* Placeholder for premium art image */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, #e0f2fe 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800
                    }}>
                        AURORA
                    </div>
                </div>

                <div className={styles.cta} style={{ marginTop: 'auto' }}>
                    View Work <ArrowRight size={18} />
                </div>
            </motion.div>

            {/* 3. Collection Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`${styles.bentoItem} ${styles.statCard}`}
            >
                <div className={styles.badge}>
                    <ShoppingBag size={14} style={{ marginRight: '0.4rem' }} /> My Collection
                </div>
                <h3 className={styles.cardTitle}>Live Auctions</h3>
                <div className={styles.cardValue}>12</div>
                <div className={styles.cta}>
                    Track Orders <ArrowRight size={16} />
                </div>
            </motion.div>

            {/* 4. Category Highlight */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={`${styles.bentoItem} ${styles.categoryCard}`}
            >
                <div className={styles.badge}>
                    <LayoutGrid size={14} style={{ marginRight: '0.4rem' }} /> Explore
                </div>
                <h3 className={styles.cardTitle}>Trending: Abstract</h3>
                <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>
                    Discover over 2,400 abstract works from world-class artists.
                </p>
                <div className={styles.cta} style={{ marginTop: 'auto' }}>
                    Explore All <ArrowRight size={18} />
                </div>
            </motion.div>

            {/* 5. Artist Community */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className={`${styles.bentoItem} ${styles.statCard}`}
            >
                <div className={styles.badge}>
                    <Users size={14} style={{ marginRight: '0.4rem' }} /> Community
                </div>
                <h3 className={styles.cardTitle}>Following</h3>
                <div className={styles.cardValue}>48</div>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    3 artists posted new work today.
                </p>
            </motion.div>
        </section>
    );
}
