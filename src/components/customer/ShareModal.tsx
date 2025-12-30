'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Twitter, Linkedin, Send, Share2 } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productUrl: string;
}

export default function ShareModal({ isOpen, onClose, productName, productUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: <Send size={24} className="text-[#25D366]" />,
            handler: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this masterpiece: ${productName} ${productUrl}`)}`, '_blank');
            }
        },
        {
            name: 'X (Twitter)',
            icon: <Twitter size={24} className="text-white" />,
            handler: () => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this masterpiece: ${productName}`)}&url=${encodeURIComponent(productUrl)}`, '_blank');
            }
        },
        {
            name: 'LinkedIn',
            icon: <Linkedin size={24} className="text-[#0A66C2]" />,
            handler: () => {
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(productUrl)}`, '_blank');
            }
        },
    ];

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(productUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // Fallback for insecure contexts
                const textArea = document.createElement("textarea");
                textArea.value = productUrl;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback copy failed', err);
                }
                document.body.removeChild(textArea);
            }
        } catch (err) {
            console.error('Clipboard error', err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[3000]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl z-[3001] overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        <Share2 size={20} />
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-tighter italic text-white">Share Masterpiece</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-6">Spread the Artistic Vision</p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {shareOptions.map((option) => (
                                    <button
                                        key={option.name}
                                        onClick={option.handler}
                                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group"
                                    >
                                        <div className="transition-transform group-hover:scale-110 duration-300">
                                            {option.icon}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                                            {option.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Copy Vision Link</label>
                                <div className="flex gap-2 p-2 rounded-2xl bg-black/40 border border-white/5 focus-within:border-blue-500/50 transition-colors group">
                                    <input
                                        type="text"
                                        readOnly
                                        value={productUrl}
                                        className="flex-1 bg-transparent border-none outline-none text-xs text-zinc-300 px-3 font-medium"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
                                            ${copied
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                            }
                                        `}
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={14} strokeWidth={3} /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} strokeWidth={3} /> Copy
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
