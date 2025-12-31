'use client';

import React from 'react';
import { X, User, ExternalLink, Mail, Phone, Calendar, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Seller {
    id: string;
    full_name: string;
    email?: string;
    mobile?: string;
    bio?: string;
    portfolio_url?: string;
    avatar_url?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface SellerModalProps {
    isOpen: boolean;
    onClose: () => void;
    seller: Seller | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

export default function SellerModal({ isOpen, onClose, seller, onApprove, onReject }: SellerModalProps) {
    if (!isOpen || !seller) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-y-auto"
                    >
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full -ml-32 -mb-32 pointer-events-none" />

                        <div className="relative p-7 md:p-14">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-3 rounded-full bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-all z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Main Info Section */}
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
                                {/* Large Avatar */}
                                <div className="relative shrink-0">
                                    <div className="absolute -inset-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] md:rounded-[2.5rem] blur opacity-30"></div>
                                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border-2 border-white/10 bg-zinc-900 flex items-center justify-center shadow-2xl">
                                        {seller.avatar_url ? (
                                            <img src={seller.avatar_url} alt={seller.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-zinc-700" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left pt-2">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-3">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase leading-none">{seller.full_name}</h2>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current transition-all ${seller.status === 'approved'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                                            : seller.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border-blue-400/30 animate-pulse'
                                            }`}>
                                            {seller.status === 'approved' ? 'Verified Artist' : seller.status === 'rejected' ? 'Access Revoked' : 'Pending Verification'}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                                        "{seller.bio || 'The artist chose to let their work speak for itself.'}"
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Grid Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
                                <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-1 group hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center gap-3 text-zinc-500 mb-2">
                                        <Mail size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Digital Link</span>
                                    </div>
                                    <p className="text-white font-bold tracking-tight text-lg break-all">{seller.email}</p>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-1 group hover:border-indigo-500/30 transition-all">
                                    <div className="flex items-center gap-3 text-zinc-500 mb-2">
                                        <Phone size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Direct Contact</span>
                                    </div>
                                    <p className="text-white font-bold tracking-tight text-lg">{seller.mobile || 'Restricted'}</p>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-1 group hover:border-purple-500/30 transition-all">
                                    <div className="flex items-center gap-3 text-zinc-500 mb-2">
                                        <Calendar size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">System Integration</span>
                                    </div>
                                    <p className="text-white font-bold tracking-tight text-lg">
                                        {new Date(seller.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>

                                <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5 space-y-1 group hover:border-amber-500/30 transition-all">
                                    <div className="flex items-center gap-3 text-zinc-500 mb-2">
                                        <ExternalLink size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Global Portfolio</span>
                                    </div>
                                    {seller.portfolio_url ? (
                                        <a
                                            href={seller.portfolio_url.startsWith('http') ? seller.portfolio_url : `https://${seller.portfolio_url}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-amber-400 font-bold tracking-tight text-lg hover:text-amber-300 transition-colors flex items-center gap-2"
                                        >
                                            View External Link <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <p className="text-zinc-600 font-bold tracking-tight text-lg">No Link Provided</p>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-4">
                                {seller.status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => { onApprove(seller.id); onClose(); }}
                                            className="flex-1 h-14 md:h-16 bg-emerald-500 text-white font-black rounded-xl md:rounded-2xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-xs"
                                        >
                                            <CheckCircle2 size={18} />
                                            Authorize
                                        </button>
                                        <button
                                            onClick={() => { onReject(seller.id); onClose(); }}
                                            className="flex-1 h-14 md:h-16 bg-white/5 border border-white/10 text-white font-black rounded-xl md:rounded-2xl hover:bg-red-500 hover:border-red-500 transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] md:text-xs"
                                        >
                                            <XCircle size={18} />
                                            Decline
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className="w-full h-16 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
                                    >
                                        Close Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
