import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const supabase = createClient();

    // 1. Check Auth (Server-Side)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Buyers don't need role check, any auth user can be a "buyer" or view dashboard.
    // Unless we want to restrict 'sellers' from this view? 
    // For now, let's allow everyone to access 'my collection' (even sellers might buy).

    return (
        <>
            {children}
        </>
    );
}
