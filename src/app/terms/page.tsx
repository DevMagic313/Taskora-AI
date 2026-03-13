import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";

export const metadata = {
    title: "Terms of Service — Taskora AI",
    description: "Read the terms and conditions governing your use of Taskora AI services.",
};

export default function TermsPage() {
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
                        <FileText className="h-4 w-4" /> Legal
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Terms of Service</h1>
                    <p className="text-muted-foreground font-medium">Last updated: February 25, 2026</p>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            By accessing or using Taskora AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. These terms apply to all users, including visitors, registered users, and premium subscribers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">2. Description of Service</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Taskora AI is an AI-powered task management platform. We provide tools for task creation, organization, AI-generated task decomposition, analytics, and team collaboration features. Our service is provided &quot;as is&quot; and may be updated or modified at any time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">3. User Accounts</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">4. Acceptable Use</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed mb-3">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground font-medium">
                            <li>Use the service for any unlawful purpose</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the service or servers</li>
                            <li>Upload malicious content or harmful code</li>
                            <li>Use automated systems to access the service excessively</li>
                            <li>Violate any applicable laws or regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">5. Intellectual Property</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Taskora AI and all related content, features, and functionality are owned by Taskora AI Workspace. The content you create using our service remains yours. We do not claim ownership over your task data, descriptions, or generated content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">6. Limitation of Liability</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Taskora AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our liability is limited to the amount you paid for the service in the twelve months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">7. Termination</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            We reserve the right to suspend or terminate your account at any time if you violate these terms. You may delete your account at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">8. Changes to Terms</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            We may modify these terms at any time. We will notify users of significant changes via email or in-app notification. Continued use of the service after changes constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold tracking-tight mb-4">9. Contact</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            For questions about these terms, please contact us at <span className="text-primary font-bold">support@taskora.ai</span>.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
