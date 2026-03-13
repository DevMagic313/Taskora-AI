import Link from "next/link";
import { Sparkles, Briefcase, MapPin, ArrowRight, Heart, Clock } from "lucide-react";

export const metadata = {
    title: "Careers — Taskora AI",
    description: "Join the Taskora AI team. Explore open roles and help us build the future of AI-powered productivity.",
};

export default function CareersPage() {
    const positions = [
        { title: "Senior Full-Stack Engineer", location: "Remote", type: "Full-Time", department: "Engineering", description: "Build and scale our Next.js / Supabase stack. Work on AI integrations and real-time features." },
        { title: "AI/ML Engineer", location: "Remote", type: "Full-Time", department: "AI", description: "Design and optimize our LLM pipeline for task decomposition. Fine-tune models for better output quality." },
        { title: "Product Designer", location: "Remote", type: "Full-Time", department: "Design", description: "Craft beautiful, intuitive interfaces for our task management platform. Lead design system development." },
        { title: "DevRel Engineer", location: "Remote", type: "Part-Time", department: "Community", description: "Build developer community, create tutorials, and represent Taskora AI at conferences and meetups." },
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
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Briefcase className="h-4 w-4" /> Careers
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">Build with us.</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
                        We&apos;re looking for talented people who want to shape the future of AI-powered productivity tools.
                    </p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8 sm:p-10 mb-12 sm:mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold tracking-tight">Why Taskora?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {["Remote-first culture", "Competitive salary", "Modern tech stack", "Ship daily", "Work-life balance", "Growth opportunities"].map((perk) => (
                            <div key={perk} className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                {perk}
                            </div>
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl font-bold tracking-tight mb-6">Open Positions</h2>
                <div className="space-y-4">
                    {positions.map((pos) => (
                        <div key={pos.title} className="group rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5 cursor-pointer">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="inline-flex items-center rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-[10px] font-bold text-primary uppercase tracking-wider">{pos.department}</span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                            <MapPin className="h-3 w-3" /> {pos.location}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                            <Clock className="h-3 w-3" /> {pos.type}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">{pos.title}</h3>
                                    <p className="text-sm text-muted-foreground font-medium mt-1">{pos.description}</p>
                                </div>
                                <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16 rounded-3xl border border-border/50 bg-card p-8 sm:p-12">
                    <h3 className="text-xl font-bold tracking-tight mb-3">Don&apos;t see your role?</h3>
                    <p className="text-muted-foreground font-medium mb-6">We&apos;re always looking for talented people. Send us your resume and tell us how you can contribute.</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-xl px-8 py-4 shadow-xl hover:opacity-90 transition-all active:scale-[0.97]">
                        Get in Touch <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
