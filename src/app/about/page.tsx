import Link from "next/link";
import { Sparkles, Heart, Target, Users, ArrowRight, Globe, Award } from "lucide-react";

export const metadata = {
    title: "About — Taskora AI",
    description: "Learn about the team and mission behind Taskora AI — building the future of AI-powered task management.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto border-b border-border/10">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5 text-white" /></div>
                    <span className="text-2xl font-black tracking-tighter">Taskora AI</span>
                </Link>
                <Link href="/" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">← Back to Home</Link>
            </nav>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Heart className="h-4 w-4" /> Our Story
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">Built for builders.</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
                        Taskora AI was born from a simple frustration: project planning takes too long. We believe teams should spend more time executing and less time organizing.
                    </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-8 mb-16 sm:mb-24">
                    {[
                        { icon: <Target className="h-8 w-8" />, title: "Our Mission", description: "To democratize intelligent task management by making AI-powered planning accessible to every individual and team, regardless of size." },
                        { icon: <Globe className="h-8 w-8" />, title: "Our Vision", description: "A world where complex projects are broken down and executed effortlessly, letting builders focus on what they do best — building great things." },
                        { icon: <Award className="h-8 w-8" />, title: "Our Values", description: "Speed, simplicity, and security. We ship fast, keep interfaces clean, and treat your data with the highest level of protection." },
                    ].map((item) => (
                        <div key={item.title} className="rounded-3xl border border-border/50 bg-card p-8 shadow-sm text-center">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mx-auto mb-6 shadow-lg">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-bold tracking-tight mb-3">{item.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed text-sm">{item.description}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-card to-background border border-border/50 p-8 sm:p-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold tracking-tight">The Team</h2>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed mb-6">
                        We&apos;re a small but mighty team of engineers and designers passionate about developer productivity. Based globally, working remotely, shipping daily.
                    </p>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        Taskora AI is built with Next.js 16, TypeScript, Supabase, and Groq AI — a modern stack for a modern product. We dogfood our own product every single day to build better features.
                    </p>
                </div>

                <div className="text-center mt-16">
                    <Link href="/careers" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-xl px-8 py-4 text-lg shadow-xl hover:opacity-90 transition-all active:scale-[0.97]">
                        Join the Team <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
