"use server";

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getSupabase() {
    const cookieStore = await cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) { return cookieStore.get(name)?.value },
                set(name: string, value: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value, ...options }) } catch (error) { }
                },
                remove(name: string, options: CookieOptions) {
                    try { cookieStore.set({ name, value: '', ...options }) } catch (error) { }
                },
            },
        }
    );
}

/**
 * Suggest tags using OpenAI Vision API (GPT-4o-mini)
 * 
 * This action takes an image (as base64 or URL) and returns 
 * descriptive artistic tags.
 */
export async function suggestArtworkTags(imageBase64: string) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("OPENAI_API_KEY is missing. Falling back to mock tags.");
        // Mock fallback for development if key is missing
        await new Promise(r => setTimeout(r, 1000));
        return ["Contemporary", "Abstract", "Canvas", "Modern", "Oil"];
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analyze this artwork and provide exactly 5 descriptive tags (names only, comma separated) that describe its medium, style, and mood. For example: Oil, Impressionism, Vibrant, Landscape, Textured."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageBase64 // Expects "data:image/jpeg;base64,..."
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 50
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        // Parse "Tag1, Tag2, Tag3" into ["Tag1", "Tag2", "Tag3"]
        return content.split(",").map((t: string) => t.trim().replace(/^#/, ''));

    } catch (error) {
        console.error("AI Vision Error:", error);
        return ["Art", "Gallery"];
    }
}
