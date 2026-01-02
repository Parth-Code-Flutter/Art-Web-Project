'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    CheckCircle2,
    MessageCircle,
    Mail,
    ArrowRight,
    ShoppingBag,
    Copy,
    Check,
    Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('id');
    const [order, setOrder] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        const { data } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single();
        if (data) setOrder(data);
    };

    const copyOrderId = () => {
        if (orderId) {
            navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const whatsappMessage = order ?
        `Hello Art Gallery! I have successfully reserved a masterpiece. %0A%0AOrder ID: ${orderId}%0AName: ${order.full_name}%0AItems: ${order.order_items.map((i: any) => i.product_name).join(', ')}%0AAmount: ₹${order.total_amount.toLocaleString()}%0A%0APlease share the payment protocols.`
        : '';

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 pt-24 pb-20">
            <div className="max-w-2xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-zinc-950 border border-white/5 rounded-[3rem] p-10 lg:p-16 text-center space-y-10 relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                        <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-500 shadow-2xl">
                            <CheckCircle2 size={40} />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl lg:text-5xl font-black text-white italic uppercase tracking-tighter">Reservation <br />Successful</h1>
                            <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">Protocol Sequence Complete</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Secure Reservation ID</p>
                            <div className="flex items-center justify-center gap-4">
                                <code className="text-sm font-mono text-white tracking-wider">{orderId?.slice(0, 18)}...</code>
                                <button onClick={copyOrderId} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-500 hover:text-white">
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-zinc-500 max-w-sm mx-auto leading-relaxed">
                            Your masterpieces are now reserved in the vault. To finalize the acquisition, please initiate a direct sync with our curators.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a
                            href={`https://wa.me/919999999999?text=${whatsappMessage}`}
                            target="_blank"
                            className="bg-emerald-500 text-black h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-95"
                        >
                            <MessageCircle size={18} /> Sync via WhatsApp
                        </a>
                        <button
                            className="bg-white/[0.05] text-white border border-white/10 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white/[0.08] transition-all active:scale-95"
                        >
                            <Mail size={18} /> Receive Invoice
                        </button>
                    </div>

                    <div className="pt-8 border-t border-white/[0.03]">
                        <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                            Return to Command Center <ArrowRight size={14} />
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-8 flex justify-center gap-12 grayscale opacity-30">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12} /> Authentic</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12} /> Secured</div>
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"><CheckCircle2 size={12} /> Global</div>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
