"use client";

import { Navbar } from "@/components/Navbar";
import { updateProfile } from "@/app/actions/profiles";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { Loader2, Save, User, FileText, AtSign } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

            setProfile(data);
            setFetching(false);
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateProfile(formData);

        if (result?.error) {
            alert("Error updating profile: " + result.error);
        } else {
            alert("Profile updated successfully!");
        }
        setLoading(false);
    };

    if (fetching) return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <Navbar />

            <main className="max-w-2xl mx-auto px-6 py-32">
                <div className="space-y-2 mb-12">
                    <h1 className="text-3xl font-serif font-bold">Profile Settings</h1>
                    <p className="text-zinc-500">How you appear to the ArtVerse community.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <AtSign className="w-3 h-3" /> Username
                        </label>
                        <input
                            name="username"
                            defaultValue={profile?.username}
                            required
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 outline-none focus:border-rose-500 transition-colors"
                        />
                        <p className="text-[10px] text-zinc-600 italic">Your public URL: artverse.com/artists/{profile?.username}</p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <User className="w-3 h-3" /> Display Name
                        </label>
                        <input
                            name="full_name"
                            defaultValue={profile?.full_name}
                            placeholder="e.g. Leonardo da Vinci"
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 outline-none focus:border-rose-500 transition-colors"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Bio
                        </label>
                        <textarea
                            name="bio"
                            defaultValue={profile?.bio}
                            rows={4}
                            placeholder="Tell your story..."
                            className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 outline-none focus:border-rose-500 transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-white text-black font-bold rounded-full hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                    </button>
                </form>
            </main>
        </div>
    );
}
