"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Check, Palette, ShoppingBag, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignupContent() {
    const searchParams = useSearchParams();
    const initialRole = searchParams.get("role") === "seller" ? "seller" : "user";

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<"user" | "seller">(initialRole);


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);

        if (!username || !email || !password) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }

        const supabase = createClient();

        // Sign up with Metadata for the Trigger
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
                data: {
                    username: username.trim(),
                    role: role,
                },
            },
        });

        if (error) {
            console.error("Signup Error:", error);
            setError(error.message);
        } else {
            console.log("Signup Success Data:", data);
            // Check for session to see if auto-confirmed (dev mode)
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // Determine redirect based on role
                const target = role === 'seller' ? '/sell' : '/explore';
                router.push(target);
                router.refresh();
            } else {
                setError("Account created! User confirmation is required before logging in.");
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 flex flex-col items-center justify-center p-6 relative">

            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-bold mb-2">Join ArtVerse</h1>
                    <p className="text-zinc-400">Start your journey as a Collector or Artist.</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Role Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setRole("user")}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "user"
                                ? "bg-rose-500/10 border-rose-500 text-white"
                                : "bg-black/20 border-white/10 text-zinc-400 hover:bg-white/5"
                                }`}
                        >
                            <ShoppingBag className={`w-6 h-6 ${role === 'user' ? 'text-rose-500' : ''}`} />
                            <span className="font-bold text-sm">I want to Buy</span>
                            {role === "user" && <div className="absolute top-2 right-2"><Check className="w-3 h-3 text-rose-500" /></div>}
                        </button>

                        <button
                            onClick={() => setRole("seller")}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "seller"
                                ? "bg-rose-500/10 border-rose-500 text-white"
                                : "bg-black/20 border-white/10 text-zinc-400 hover:bg-white/5"
                                }`}
                        >
                            <Palette className={`w-6 h-6 ${role === 'seller' ? 'text-rose-500' : ''}`} />
                            <span className="font-bold text-sm">I want to Sell</span>
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg h-10 px-3 focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="art_lover_99"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg h-10 px-3 focus:outline-none focus:border-rose-500 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg h-10 px-3 pr-10 focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="w-full h-12 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                    </button>

                    <div className="text-center text-sm text-zinc-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:text-rose-500 underline font-medium">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
            <SignupContent />
        </Suspense>
    );
}
