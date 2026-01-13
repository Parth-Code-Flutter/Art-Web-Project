'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Palette,
    Users,
    Award,
    Globe,
    Heart,
    Sparkles,
    TrendingUp,
    Shield,
    Zap,
    Target,
    ArrowRight
} from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { value: '10K+', label: 'Artworks', icon: Palette },
        { value: '500+', label: 'Artists', icon: Users },
        { value: '50+', label: 'Countries', icon: Globe },
        { value: '98%', label: 'Satisfaction', icon: Heart }
    ];

    const values = [
        {
            icon: Award,
            title: 'Authenticity First',
            description: 'Every piece is verified and authenticated by our expert curators to ensure you receive genuine masterpieces.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Users,
            title: 'Artist Empowerment',
            description: 'We provide a platform for emerging and established artists to showcase their work to a global audience.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Shield,
            title: 'Secure Transactions',
            description: 'Industry-leading security protocols ensure your purchases and personal information are always protected.',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            icon: Sparkles,
            title: 'Curated Excellence',
            description: 'Our team hand-selects each artwork to maintain the highest standards of quality and artistic merit.',
            color: 'from-amber-500 to-orange-500'
        }
    ];

    const team = [
        {
            role: 'Founder & CEO',
            description: 'Visionary leader with 15+ years in the art industry, passionate about democratizing art ownership.'
        },
        {
            role: 'Chief Curator',
            description: 'Former museum director with an eye for emerging talent and timeless masterpieces.'
        },
        {
            role: 'Head of Technology',
            description: 'Tech innovator bringing cutting-edge solutions to the traditional art world.'
        }
    ];

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white pt-20 pb-20 transition-colors duration-300">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 lg:py-24 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <Sparkles size={14} />
                            About Our Gallery
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Where Art Meets
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                Innovation
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8">
                            We're revolutionizing the way people discover, experience, and collect art.
                            Our platform bridges the gap between talented artists and passionate collectors worldwide.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/customer/products"
                                className="group px-6 lg:px-8 py-3 lg:py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                            >
                                Explore Gallery
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/seller/become-artist"
                                className="px-6 lg:px-8 py-3 lg:py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                            >
                                Become an Artist
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 hover:bg-zinc-900/60 transition-all group"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-400 group-hover:scale-110 transition-transform" />
                            <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                            <div className="text-sm text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Target size={14} />
                            Our Mission
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                            Democratizing Art Ownership
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                            We believe that exceptional art should be accessible to everyone. Our mission is to break down
                            the traditional barriers of the art world and create a transparent, inclusive marketplace where
                            artists thrive and collectors discover their next masterpiece.
                        </p>
                        <p className="text-zinc-400 text-lg leading-relaxed">
                            Through cutting-edge technology and a passion for creativity, we're building the future of art
                            collection—one that's fair, transparent, and inspiring for all.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10 overflow-hidden">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <Palette className="w-24 h-24 mx-auto mb-4 text-white/20" />
                                    <p className="text-white/40 font-medium">Curating Excellence</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Zap size={14} />
                        Our Values
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Drives Us</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Our core values shape every decision we make and every experience we create.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-zinc-900/40 border border-white/5 rounded-2xl p-6 lg:p-8 hover:border-white/10 hover:bg-zinc-900/60 transition-all"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-2xl bg-gradient-to-r ${value.color}`} />
                            <value.icon className="w-12 h-12 mb-4 text-white/80 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 lg:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Users size={14} />
                        Leadership Team
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4">Meet the Visionaries</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Passionate experts dedicated to transforming the art world.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {team.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 lg:p-8 hover:border-white/10 hover:bg-zinc-900/60 transition-all group text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Users className="w-10 h-10 text-white/60" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{member.role}</h3>
                            <p className="text-sm text-zinc-400 leading-relaxed">{member.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-8 lg:p-16 text-center"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

                    <div className="relative z-10">
                        <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white/80" />
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Ready to Start Your Collection?
                        </h2>
                        <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
                            Join thousands of collectors who trust us to bring exceptional art into their lives.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link
                                href="/customer/products"
                                className="group px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
                            >
                                Browse Artworks
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>
    );
}
