import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ToastProvider } from "@/components/ToastProvider";
import GoogleAnalytics from "@/lib/analytics";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://art-web-project.vercel.app'),
  title: "Art Gallery | Scalable Exhibition",
  description: "A premium, large-scale art gallery platform built with React and Next.js.",
  openGraph: {
    title: "Art Gallery | Scalable Exhibition",
    description: "A premium, large-scale art gallery platform built with React and Next.js.",
    type: 'website',
    locale: 'en_US',
    siteName: 'Art Gallery',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Art Gallery | Scalable Exhibition",
    description: "A premium, large-scale art gallery platform built with React and Next.js.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`} suppressHydrationWarning>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
