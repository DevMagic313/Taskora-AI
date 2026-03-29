import Link from "next/link";
import { Sparkles, BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Blog — Taskora AI",
    description: "Insights on productivity, AI-powered task management, and engineering best practices from the Taskora AI team.",
};

export default function BlogPage() {
    const posts = [
        {
            title: "How AI is Revolutionizing Task Management",
            excerpt: "Discover how large language models are changing the way modern teams plan and execute projects, from automated task decomposition to intelligent reprioritization and predictive scheduling.",
            date: "Mar 25, 2026",
            category: "AI & Productivity",
            readTime: "5 min read",
        },
        {
            title: "Building a Workspace-Aware Architecture",
            excerpt: "A technical deep dive into how we implemented full multi-tenant workspace isolation, Role-Based Access Control (RBAC), and Supabase Row Level Security (RLS) in Next.js.",
            date: "Mar 20, 2026",
            category: "Engineering",
            readTime: "8 min read",
        },
        {
            title: "The Art of Breaking Down Complex Goals",
            excerpt: "Learn the methodology behind our Groq-powered AI decomposition engine and how it seamlessly turns vague ideas into structured, actionable blueprints in seconds.",
            date: "Mar 12, 2026",
            category: "Product",
            readTime: "4 min read",
        },
        {
            title: "Achieving Zero Latency with Optimistic UIs",
            excerpt: "How we achieved completely instant, zero-latency user interactions across Taskora AI by leveraging Zustand for optimistic state updates and seamless edge-case rollbacks.",
            date: "Feb 28, 2026",
            category: "Engineering",
            readTime: "6 min read",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto border-b border-border/10">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5 text-white" /></div>
                    <span className="text-2xl font-black tracking-tighter">Taskora AI</span>
                </Link>
                <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <BookOpen className="h-4 w-4" /> Blog
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Insights & Updates.</h1>
                    <p className="text-lg text-muted-foreground font-medium">Thoughts on productivity, engineering, and building with AI.</p>
                </div>

                <div className="space-y-6">
                    {posts.map((post) => (
                        <article key={post.title} className="group rounded-3xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="inline-flex items-center rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">{post.category}</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" /> {post.date}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">• {post.readTime}</span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                            <p className="text-muted-foreground font-medium leading-relaxed">{post.excerpt}</p>
                            <div className="flex items-center gap-2 mt-4 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Learn more <ArrowRight className="h-4 w-4" />
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
