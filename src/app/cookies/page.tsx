import Link from "next/link";
import { Sparkles, Cookie } from "lucide-react";

export const metadata = {
    title: "Cookie Policy — Taskora AI",
    description: "Learn how Taskora AI uses cookies and similar technologies.",
};

export default function CookiesPage() {
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
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <Cookie className="h-4 w-4" /> Legal
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Cookie Policy</h1>
                    <p className="text-muted-foreground font-medium">Last updated: February 25, 2026</p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">What Are Cookies?</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Cookies are small text files placed on your device by websites you visit. They are widely used to make websites work more efficiently and to provide reporting information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">How We Use Cookies</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-4">
                            Taskora AI uses cookies for the following purposes:
                        </p>
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-border/50 bg-card p-5">
                                <h3 className="text-sm font-bold text-foreground mb-2">Essential Cookies</h3>
                                <p className="text-sm text-muted-foreground font-medium">Required for authentication and session management. These cookies are set by Supabase to maintain your login state securely via HTTP-only cookies.</p>
                            </div>
                            <div className="rounded-2xl border border-border/50 bg-card p-5">
                                <h3 className="text-sm font-bold text-foreground mb-2">Preference Cookies</h3>
                                <p className="text-sm text-muted-foreground font-medium">Store your display preferences such as theme mode (light, dark, or system). These improve your experience on return visits.</p>
                            </div>
                            <div className="rounded-2xl border border-border/50 bg-card p-5">
                                <h3 className="text-sm font-bold text-foreground mb-2">Performance Cookies</h3>
                                <p className="text-sm text-muted-foreground font-medium">Help us understand how visitors interact with Taskora AI by collecting anonymous information about page visits and usage patterns.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Managing Cookies</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            You can control and manage cookies through your browser settings. Most browsers allow you to refuse cookies or delete existing ones. However, disabling essential cookies may prevent you from being able to log in to Taskora AI.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Third-Party Cookies</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Our service may include third-party cookies from Supabase (authentication) and Vercel (hosting analytics). These cookies are governed by the respective third-party privacy and cookie policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Contact</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            If you have questions about our use of cookies, please contact us at <span className="text-primary font-bold">support@taskora.ai</span>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
