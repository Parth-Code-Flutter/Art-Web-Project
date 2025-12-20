import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * Login Page
 * 
 * Authentication entry point.
 * Ideally integrated with Clerk or Supabase later.
 */
export default function LoginPage() {
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
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg h-10 px-3 focus:outline-none focus:border-rose-500 transition-colors" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input type="password" className="w-full bg-black/50 border border-white/10 rounded-lg h-10 px-3 focus:outline-none focus:border-rose-500 transition-colors" placeholder="••••••••" />
                    </div>

                    <button className="w-full h-12 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all">
                        Sign In
                    </button>

                    <div className="text-center text-sm text-zinc-500">
                        Don&apos;t have an account? <span className="text-white font-medium cursor-pointer underline decoration-zinc-700 underline-offset-4">Join as a Creator</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
