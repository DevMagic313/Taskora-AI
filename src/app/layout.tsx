import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taskora.ai";

export const metadata: Metadata = {
  title: {
    default: "Taskora AI — Intelligent Task Management",
    template: "%s | Taskora AI",
  },
  description:
    "AI-powered task management suite for high-performance individuals and teams. Break down goals into actionable tasks using Groq AI.",
  keywords: [
    "task management",
    "AI productivity",
    "project management",
    "Groq AI",
    "task planner",
    "AI task generator",
    "productivity app",
    "team collaboration",
  ],
  authors: [{ name: "Taskora AI" }],
  creator: "Taskora AI",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Taskora AI",
    title: "Taskora AI — Intelligent Task Management",
    description:
      "AI-powered task management suite for high-performance individuals and teams. Break down goals into actionable tasks using Groq AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Taskora AI — AI-Powered Task Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskora AI — Intelligent Task Management",
    description:
      "Break down goals into actionable tasks using cutting-edge AI. Built for high-performance teams.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="system" storageKey="taskora-ui-theme">
          <AuthInitializer />
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
