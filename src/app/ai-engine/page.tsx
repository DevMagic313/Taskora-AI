import Link from "next/link";
import { Sparkles, Brain, Zap, Cpu, ArrowRight, Workflow, Gauge } from "lucide-react";

export const metadata = {
    title: "AI Engine — Taskora AI",
    description: "Learn how Taskora AI uses Groq-powered LLMs to intelligently break down project goals into actionable task blueprints.",
};

export default function AIEnginePage() {
    const steps = [
        { step: "01", title: "Describe Your Goal", description: "Type a natural language description of your project, goal, or objective. Be as detailed or brief as you like.", icon: <Brain className="h-6 w-6" /> },
        { step: "02", title: "AI Analyzes & Decomposes", description: "The Groq LLM processes your input, understanding context, dependencies, and priorities to create a structured breakdown.", icon: <Cpu className="h-6 w-6" /> },
        { step: "03", title: "Review the Blueprint", description: "View the generated task tree with titles, descriptions, and priority levels. Each task is a self-contained action item.", icon: <Workflow className="h-6 w-6" /> },
        { step: "04", title: "Save & Execute", description: "Save individual tasks or the entire blueprint to your workspace. Start working immediately with everything organized.", icon: <Zap className="h-6 w-6" /> },
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

            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Brain className="h-4 w-4" /> Intelligence Engine
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">Powered by Groq AI.</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">Our AI engine uses state-of-the-art language models to transform your ideas into structured, actionable task blueprints.</p>
                </div>

                {/* How it works */}
                <div className="space-y-6">
                    {steps.map((step) => (
                        <div key={step.step} className="group flex items-start gap-6 sm:gap-8 rounded-3xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-primary/20 font-black text-lg">
                                {step.step}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-primary">{step.icon}</span>
                                    <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                                </div>
                                <p className="text-muted-foreground font-medium leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="mt-16 sm:mt-24 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-8 sm:p-12">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-center mb-10">Performance Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "< 2s", label: "Avg Generation" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "7+", label: "Tasks per Query" },
                            { value: "500+", label: "Happy Users" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl font-black tracking-tighter gradient-text">{stat.value}</div>
                                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-16">
                    <Link href="/register" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-xl px-8 py-4 text-lg shadow-xl hover:opacity-90 transition-all active:scale-[0.97]">
                        Try AI Generation <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
