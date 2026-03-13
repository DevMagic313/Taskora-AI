import Link from "next/link";
import { Sparkles, Shield, Globe } from "lucide-react";

export const metadata = {
    title: "GDPR Compliance — Taskora AI",
    description: "Learn about Taskora AI's commitment to GDPR compliance and your data protection rights.",
};

export default function GDPRPage() {
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
                        <Globe className="h-4 w-4" /> Legal
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">GDPR Compliance</h1>
                    <p className="text-muted-foreground font-medium">Last updated: February 25, 2026</p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 p-6 sm:p-8 mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <h3 className="font-bold">Our Commitment</h3>
                    </div>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        Taskora AI is committed to protecting the privacy and security of your personal data in compliance with the General Data Protection Regulation (GDPR). We process data lawfully, fairly, and transparently.
                    </p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Your Rights Under GDPR</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-4">As a data subject, you have the following rights:</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                { title: "Right to Access", description: "Request a copy of the personal data we hold about you." },
                                { title: "Right to Rectification", description: "Request correction of inaccurate or incomplete data." },
                                { title: "Right to Erasure", description: "Request deletion of your personal data ('right to be forgotten')." },
                                { title: "Right to Portability", description: "Receive your data in a structured, machine-readable format." },
                                { title: "Right to Restrict", description: "Request restriction of processing of your personal data." },
                                { title: "Right to Object", description: "Object to processing of your personal data for certain purposes." },
                            ].map((right) => (
                                <div key={right.title} className="rounded-2xl border border-border/50 bg-card p-5">
                                    <h3 className="text-sm font-bold text-foreground mb-2">{right.title}</h3>
                                    <p className="text-xs text-muted-foreground font-medium">{right.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Legal Basis for Processing</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-3">We process your personal data based on:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
                            <li><strong>Contract:</strong> To provide you with our task management services</li>
                            <li><strong>Consent:</strong> For optional features like AI task generation</li>
                            <li><strong>Legitimate Interest:</strong> To improve our services and ensure security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Data Protection Officer</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            For any GDPR-related inquiries, data access requests, or complaints, please contact our Data Protection Officer at <span className="text-primary font-bold">dpo@taskora.ai</span>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">International Transfers</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Your data may be processed in regions outside the European Economic Area (EEA). In such cases, we ensure appropriate safeguards through Standard Contractual Clauses (SCCs) or other approved mechanisms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">Supervisory Authority</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            If you believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority. We encourage you to contact us first so we can address your concern.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
