import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminLayout({
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

    // 2. Check Role (Strict Admin)
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/"); // Send non-admins to home
    }

    return (
        <>
            {children}
        </>
    );
}
