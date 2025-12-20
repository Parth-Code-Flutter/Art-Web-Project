import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const supabase = createClient();

    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Check Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "seller" && profile?.role !== "admin") {
        // If not a seller, redirect home or to buyer dashboard
        redirect("/dashboard");
    }

    return (
        <>
            {children}
        </>
    );
}
