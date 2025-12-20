"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function createArtwork(formData: FormData) {
    const supabase = createClient();

    // 1. Authenticate User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("You must be logged in to sell art.");
    }

    // 2. Extract Data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const width = parseFloat(formData.get("width") as string);
    const height = parseFloat(formData.get("height") as string);
    const category = formData.get("category") as string;
    const tagsString = formData.get("tags") as string; // JSON string of tags
    const file = formData.get("image") as File;

    if (!file) {
        return { error: "No image file provided." };
    }

    // 3. Upload Image to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { error: "Failed to upload image." };
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);

    // 5. Insert Record into Database
    const tags = tagsString ? JSON.parse(tagsString) : [];

    const { error: dbError } = await supabase
        .from('artworks')
        .insert({
            title,
            description,
            artist_id: user.id, // Current logged-in user
            price,
            width,
            height,
            category,
            tags,
            image_url: publicUrl,
            status: 'available'
        });

    if (dbError) {
        console.error("Database Error:", dbError);
        // Optional: Cleanup uploaded file if DB fails
        return { error: "Failed to save artwork details." };
    }

    // 6. Revalidate & Redirect
    redirect("/explore");
}
