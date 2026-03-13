import Link from "next/link";
import { Sparkles, Zap, Brain, Shield, Activity, Terminal, Layers, ArrowRight, BarChart3 } from "lucide-react";

export const metadata = {
    title: "Features — Taskora AI",
    description: "Explore the powerful features of Taskora AI that help you manage tasks smarter with AI-powered planning, analytics, and more.",
};

export default function FeaturesPage() {
    const features = [
        { icon: <Brain className="h-8 w-8" />, title: "Groq AI Engine", description: "Powered by cutting-edge LLMs via Groq, Taskora breaks down complex project goals into structured, actionable sub-tasks in seconds. Simply describe your vision and let AI handle the decomposition.", color: "from-violet-500 to-purple-600" },
        { icon: <Zap className="h-8 w-8" />, title: "Optimistic UI Updates", description: "Experience zero-latency interactions. Every task toggle, edit, and deletion reflects instantly in the UI while syncing silently in the background. If something fails, changes are automatically reverted.", color: "from-amber-500 to-orange-600" },
        { icon: <Activity className="h-8 w-8" />, title: "Advanced Analytics", description: "Gain deep insights into your productivity with real-time visualizations. Track completion rates, priority distributions, and time-based trends to optimize your workflow.", color: "from-emerald-500 to-green-600" },
        { icon: <Shield className="h-8 w-8" />, title: "Enterprise Security", description: "Built on Supabase with Row Level Security (RLS), your data is completely isolated. Auth tokens are managed via HTTP-only cookies for maximum security against XSS attacks.", color: "from-blue-500 to-cyan-600" },
        { icon: <Terminal className="h-8 w-8" />, title: "Developer First", description: "Clean REST APIs with strict TypeScript definitions throughout. Built on Next.js 16 with serverless architecture, making it easy to extend, customize, and deploy anywhere.", color: "from-slate-500 to-zinc-600" },
        { icon: <Layers className="h-8 w-8" />, title: "Multi-Platform", description: "Fully responsive design with a dedicated mobile bottom navigation, tablet sidebar, and desktop full-width layout. Works beautifully on every screen size.", color: "from-pink-500 to-rose-600" },
        { icon: <BarChart3 className="h-8 w-8" />, title: "Smart Categories", description: "Organize tasks with custom categories and filter by status, priority, or search terms. Keep your workspace clean and focused with powerful filtering controls.", color: "from-indigo-500 to-blue-600" },
        { icon: <Sparkles className="h-8 w-8" />, title: "AI Task Generation", description: "Use auto-generation from the AI Planner to create entire project roadmaps. Save individual tasks or bulk-save the complete blueprint to your workspace.", color: "from-primary to-accent" },
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Sparkles className="h-4 w-4" /> Platform Features
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">Everything you need to ship.</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">Taskora AI combines powerful AI task generation with a sleek, modern interface designed for maximum productivity.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                    {features.map((feature) => (
                        <div key={feature.title} className="group bg-card rounded-3xl p-8 sm:p-10 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="relative z-10">
                                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16 sm:mt-24">
                    <Link href="/register" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-xl px-8 py-4 text-lg shadow-xl hover:opacity-90 transition-all active:scale-[0.97]">
                        Get Started Free <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
