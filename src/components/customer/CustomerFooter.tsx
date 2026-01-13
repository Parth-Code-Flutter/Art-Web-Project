'use client';

import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';

export default function CustomerFooter() {
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await supabase
                .from('categories')
                .select('id, name')
                .order('name')
                .limit(5);
            if (data) setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
                    {/* Brand Section */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                                <span className="font-bold text-sm">AG</span>
                            </div>
                            <span className="text-2xl font-heading font-bold text-white tracking-tight">ArtGallery</span>
                        </div>
                        <p className="text-zinc-400 leading-relaxed max-w-sm">
                            Experience the future of art with ArtGallery. We provide a premium platform for visionary artists and collectors worldwide.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-white hover:text-black transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white font-semibold mb-6">Collections</h3>
                            <ul className="space-y-4">
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <li key={cat.id}>
                                            <Link
                                                href={`/customer/categories/${encodeURIComponent(cat.name)}`}
                                                className="text-zinc-400 hover:text-blue-400 transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-zinc-600 text-sm">Loading...</li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-6">Services</h3>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Curated Collections</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Artist Spotlight</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Art Consulting</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Private Viewings</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Exhibition Planning</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-6">Company</h3>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Our Team</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Careers</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Blog</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-6">Support</h3>
                            <ul className="space-y-4">
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Help Center</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Artists FAQ</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Buyers FAQ</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Shipping Info</Link></li>
                                <li><Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">Returns Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Mail size={24} /></div>
                        <div>
                            <span className="block text-sm text-zinc-500 mb-1">Email us at</span>
                            <strong className="text-white">sales@artgallery.com</strong>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Phone size={24} /></div>
                        <div>
                            <span className="block text-sm text-zinc-500 mb-1">Call us</span>
                            <strong className="text-white">+1 888 777 4629</strong>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><MapPin size={24} /></div>
                        <div>
                            <span className="block text-sm text-zinc-500 mb-1">Visit Us</span>
                            <strong className="text-white">Las Vegas, NV 89107</strong>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
                    <div className="text-center md:text-left">
                        Copyright © 2025 ArtGallery. All Rights Reserved.
                    </div>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
                        <Link href="#" className="hover:text-white transition-colors">Security</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
