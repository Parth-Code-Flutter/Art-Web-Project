import React from 'react';
import Link from 'next/link';
import {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    Phone,
    MapPin,
    ArrowRight
} from 'lucide-react';
import styles from './CustomerFooter.module.css';

export default function CustomerFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topSection}>
                    {/* Brand Section */}
                    <div className={styles.brandCol}>
                        <div className={styles.logo}>
                            <span className={styles.logoText}>ArtGallery</span>
                        </div>
                        <p className={styles.brandDesc}>
                            Experience the future of art with ArtGallery. We provide a premium platform for visionary artists and collectors worldwide.
                        </p>
                        <div className={styles.socialLinks}>
                            <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Linkedin size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className={styles.linksGrid}>
                        <div className={styles.linkCol}>
                            <h3>Collections</h3>
                            <ul>
                                <li><Link href="/customer/categories/abstract">Abstract Art</Link></li>
                                <li><Link href="/customer/categories/digital">Digital Art</Link></li>
                                <li><Link href="/customer/categories/oil">Oil Painting</Link></li>
                                <li><Link href="/customer/categories/photography">Photography</Link></li>
                                <li><Link href="/customer/categories/sculpture">Sculpture</Link></li>
                            </ul>
                        </div>
                        <div className={styles.linkCol}>
                            <h3>Services</h3>
                            <ul>
                                <li><Link href="#">Curated Collections</Link></li>
                                <li><Link href="#">Artist Spotlight</Link></li>
                                <li><Link href="#">Art Consulting</Link></li>
                                <li><Link href="#">Private Viewings</Link></li>
                                <li><Link href="#">Exhibition Planning</Link></li>
                            </ul>
                        </div>
                        <div className={styles.linkCol}>
                            <h3>Company</h3>
                            <ul>
                                <li><Link href="#">About Us</Link></li>
                                <li><Link href="#">Our Team</Link></li>
                                <li><Link href="#">Careers</Link></li>
                                <li><Link href="#">Blog</Link></li>
                                <li><Link href="#">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div className={styles.linkCol}>
                            <h3>Support</h3>
                            <ul>
                                <li><Link href="#">Help Center</Link></li>
                                <li><Link href="#">Artists FAQ</Link></li>
                                <li><Link href="#">Buyers FAQ</Link></li>
                                <li><Link href="#">Shipping Info</Link></li>
                                <li><Link href="#">Returns Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.contactBanner}>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}><Mail size={24} /></div>
                        <div className={styles.contactInfo}>
                            <span>Email us at</span>
                            <strong>sales@artgallery.com</strong>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}><Phone size={24} /></div>
                        <div className={styles.contactInfo}>
                            <span>Call us</span>
                            <strong>+1 888 777 4629</strong>
                        </div>
                    </div>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}><MapPin size={24} /></div>
                        <div className={styles.contactInfo}>
                            <span>Visit Us</span>
                            <strong>Las Vegas, NV 89107</strong>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <div className={styles.copyright}>
                        Copyright © 2025 ArtGallery. All Rights Reserved.
                    </div>
                    <div className={styles.legalLinks}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms & Conditions</Link>
                        <Link href="#">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
