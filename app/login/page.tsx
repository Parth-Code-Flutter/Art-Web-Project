"use client";

import Link from "next/link";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Login Page (Functional)
 * 
 * Authentication entry point using Supabase.
 */
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/"); // Redirect to home on success
            router.refresh(); // Refresh to update Navbar state
        }
    };

    const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // For demo, we auto-confirm if possible or just sign up
        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
        });

        if (error) {
            setError(error.message);
        } else {
            setError("Check your email for the confirmation link!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white selection:bg-rose-500 flex flex-col items-center justify-center p-6 relative">

            {/* Back to Home Action */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-zinc-400">Sign in to manage your collection or shop.</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 p-8 rounded-2xl backdrop-blur-sm space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

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

                    <div className="flex gap-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="flex-1 h-12 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="flex-1 h-12 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
