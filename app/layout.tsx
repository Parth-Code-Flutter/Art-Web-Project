import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArtVerse | Premium Art Marketplace",
  description: "Discover and collect unique digital and physical masterpieces from visionary artists. Experience art with Augmented Reality (AR) before you buy.",
  openGraph: {
    title: "ArtVerse | Experience Art in AR",
    description: "The next generation of art marketplaces. Shop curated pieces and preview them in your own space using our AR technology.",
    url: 'https://artverse-marketplace.vercel.app', // Placeholder
    siteName: 'ArtVerse',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200',
        width: 1200,
        height: 630,
        alt: 'ArtVerse Premium Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArtVerse | Discover Rare Art',
    description: 'Collect masterpieces from verified artists with AR preview capabilities.',
    images: ['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200'],
  },
};

import { CartProvider } from "@/components/providers/CartProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-zinc-950 text-zinc-50`}
        suppressHydrationWarning
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
