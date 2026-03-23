"use client";

import dynamicImport from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const AIChatBubble = dynamicImport(
    () => import("@/features/ai/components/AIChatBubble").then((mod) => ({ default: mod.AIChatBubble })),
    { ssr: false }
);

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-40 mix-blend-multiply dark:mix-blend-overlay dark:opacity-20" />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/8 dark:bg-primary/5 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/8 dark:bg-accent/5 blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-1 pt-14 max-w-[1600px] w-full mx-auto">
                    <Sidebar />
                    <main className="flex-1 w-full min-h-[calc(100vh-3.5rem)] pb-20 md:pb-0 overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>

            {/* AI Chat Assistant — loaded on client only */}
            <AIChatBubble />
        </div>
    );
}
