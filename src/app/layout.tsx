import type { Metadata } from "next";
import { headerFont, bodyFont } from "@/config/fonts";
import { ToastProvider } from "@/components/providers/ToastProvider";
import GoogleAnalytics from "@/lib/analytics";
import "./globals.css";

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

import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
      <body className={`${headerFont.variable} ${bodyFont.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
