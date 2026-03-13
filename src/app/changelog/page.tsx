import Link from "next/link";
import { Sparkles, Clock, Zap, Star, Bug, Layers } from "lucide-react";

export const metadata = {
    title: "Changelog — Taskora AI",
    description: "See what's new in Taskora AI. Track all updates, improvements, and bug fixes.",
};

export default function ChangelogPage() {
    const releases = [
        {
            version: "v1.2.0",
            date: "Feb 25, 2026",
            title: "Task Editing & Team Assignment",
            type: "feature" as const,
            changes: [
                "Added task editing — click the pencil icon on any task to edit all fields",
                "New 'Assigned To' field for team-based task management",
                "New 'Pending Reason' field to explain blockers on pending tasks",
                "TaskEditModal with pre-filled data and inline validation",
            ],
        },
        {
            version: "v1.1.0",
            date: "Feb 25, 2026",
            title: "Homepage Overhaul & Responsive Design",
            type: "improvement" as const,
            changes: [
                "Added Pricing, Testimonials, and expanded Footer sections to landing page",
                "Full responsive design across all pages (mobile, tablet, desktop)",
                "Mobile bottom navigation bar for quick access on small screens",
                "Logo now navigates back to homepage from dashboard",
            ],
        },
        {
            version: "v1.0.0",
            date: "Feb 24, 2026",
            title: "Initial Launch",
            type: "feature" as const,
            changes: [
                "Core task management with CRUD operations and Supabase backend",
                "AI-powered task generation using Groq LLMs",
                "Dashboard with productivity analytics and completion tracking",
                "Supabase Auth with Row Level Security",
                "Optimistic UI updates with automatic rollback",
                "Theme system with light, dark, and system modes",
            ],
        },
    ];

    const typeStyles = {
        feature: { icon: <Star className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
        improvement: { icon: <Zap className="h-4 w-4" />, color: "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
        fix: { icon: <Bug className="h-4 w-4" />, color: "bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto border-b border-border/10">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5 text-white" /></div>
                    <span className="text-2xl font-black tracking-tighter">Taskora AI</span>
                </Link>
                <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
            </nav>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Layers className="h-4 w-4" /> Changelog
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">What&apos;s new.</h1>
                    <p className="text-lg text-muted-foreground font-medium">Track every update, improvement, and fix we ship.</p>
                </div>

                <div className="space-y-8 relative">
                    <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary/30 via-border/50 to-transparent pointer-events-none hidden sm:block" />
                    {releases.map((release) => (
                        <div key={release.version} className="relative flex gap-6 sm:gap-8">
                            <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20 z-10 text-xs font-bold">
                                {release.version.replace('v', '')}
                            </div>
                            <div className="flex-1 rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="text-sm font-black tracking-tight sm:hidden">{release.version}</span>
                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold capitalize ${typeStyles[release.type].color}`}>
                                        {typeStyles[release.type].icon} {release.type}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                        <Clock className="h-3.5 w-3.5" /> {release.date}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold tracking-tight mb-4">{release.title}</h3>
                                <ul className="space-y-2">
                                    {release.changes.map((change, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground font-medium">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                            {change}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
