import Link from "next/link";
import { Sparkles, Shield } from "lucide-react";

export const metadata = {
    title: "Privacy Policy — Taskora AI",
    description: "Read about how Taskora AI collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
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
                        <Shield className="h-4 w-4" /> Legal
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground font-medium">Last updated: February 25, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            When you create an account on Taskora AI, we collect your name, email address, and any information you voluntarily provide through our platform, including task data, descriptions, and planning inputs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-3">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
                            <li>Provide, maintain, and improve Taskora AI services</li>
                            <li>Process your task data through our AI engine for task generation</li>
                            <li>Send important account-related notifications</li>
                            <li>Analyze usage patterns to improve user experience</li>
                            <li>Ensure security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">3. Data Storage & Security</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Your data is stored securely on Supabase infrastructure with Row Level Security (RLS) policies ensuring complete data isolation. Authentication is handled via HTTP-only cookies to protect against XSS attacks. All data is encrypted in transit and at rest.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">4. AI Processing</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            When you use our AI task generation feature, your input is sent to Groq&apos;s LLM API for processing. We do not store AI conversation logs beyond the generated tasks that you explicitly save. Groq processes data according to their own privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">5. Third-Party Services</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            We use the following third-party services: Supabase (database & auth), Groq (AI processing), and Vercel (hosting). Each service has their own privacy policies governing data handling.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">6. Data Retention</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            We retain your data for as long as your account is active. You can request data deletion at any time by contacting us at support@taskora.ai. Upon account deletion, all associated task data is permanently removed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">7. Your Rights</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            You have the right to access, correct, or delete your personal data. You may export your task data at any time. To exercise these rights, please contact us at support@taskora.ai.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">8. Contact</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            If you have questions about this privacy policy, please contact us at <span className="text-primary font-bold">support@taskora.ai</span>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
