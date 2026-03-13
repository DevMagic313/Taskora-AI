import Link from "next/link";
import { Sparkles, Plug, Github, Slack, ArrowRight, Globe, Database, Cloud, Bell } from "lucide-react";

export const metadata = {
    title: "Integrations — Taskora AI",
    description: "Connect Taskora AI with your favorite tools. Integrations coming soon for Slack, GitHub, Jira, and more.",
};

export default function IntegrationsPage() {
    const integrations = [
        { name: "GitHub", description: "Auto-create tasks from issues and pull requests. Sync your development workflow.", icon: <Github className="h-8 w-8" />, status: "coming-soon" },
        { name: "Slack", description: "Get task notifications in Slack channels. Create tasks directly from messages.", icon: <Slack className="h-8 w-8" />, status: "coming-soon" },
        { name: "Vercel", description: "Track deployment tasks and auto-update status when builds complete.", icon: <Cloud className="h-8 w-8" />, status: "coming-soon" },
        { name: "Supabase", description: "Native integration for real-time database sync and authentication.", icon: <Database className="h-8 w-8" />, status: "active" },
        { name: "Webhooks", description: "Connect any service with custom webhooks for task creation and updates.", icon: <Globe className="h-8 w-8" />, status: "coming-soon" },
        { name: "Email", description: "Create tasks via email and receive digest notifications on progress.", icon: <Bell className="h-8 w-8" />, status: "coming-soon" },
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
                        <Plug className="h-4 w-4" /> Integrations
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-6">Connect your stack.</h1>
                    <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">Seamlessly integrate Taskora AI with the tools you already use. Most integrations are coming soon — stay tuned!</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {integrations.map((item) => (
                        <div key={item.name} className={`group bg-card rounded-3xl p-8 border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden ${item.status === "active" ? "border-primary/30" : "border-border/50 opacity-80"}`}>
                            <div className="relative z-10">
                                {item.status === "coming-soon" && (
                                    <span className="absolute top-0 right-0 inline-flex items-center rounded-full bg-muted border border-border px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Soon</span>
                                )}
                                {item.status === "active" && (
                                    <span className="absolute top-0 right-0 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-600 uppercase tracking-wider dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">Active</span>
                                )}
                                <div className="h-16 w-16 rounded-2xl bg-muted border border-border/50 text-foreground flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-3">{item.name}</h3>
                                <p className="text-muted-foreground leading-relaxed font-medium">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link href="/register" className="inline-flex items-center gap-2 bg-foreground text-background font-medium rounded-xl px-8 py-4 text-lg shadow-xl hover:opacity-90 transition-all active:scale-[0.97]">
                        Get Started Free <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
