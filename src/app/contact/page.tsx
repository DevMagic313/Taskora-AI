"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, Mail, Send, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
    const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

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
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                        <MessageSquare className="h-4 w-4" /> Contact
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-4">Get in touch.</h1>
                    <p className="text-lg text-muted-foreground font-medium">Have a question, feedback, or partnership inquiry? We&apos;d love to hear from you.</p>
                </div>

                <div className="grid md:grid-cols-5 gap-8 sm:gap-12">
                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <h3 className="font-bold">Email</h3>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">support@taskora.ai</p>
                        </div>
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <h3 className="font-bold">Location</h3>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Remote-first, Global Team</p>
                        </div>
                        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <Send className="h-5 w-5 text-primary" />
                                <h3 className="font-bold">Response Time</h3>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">We typically respond within 24 hours</p>
                        </div>
                    </div>

                    <div className="md:col-span-3 rounded-3xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
                        {submitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
                                    <Send className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold tracking-tight mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground font-medium">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                                        <input required value={formState.name} onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))} placeholder="Your name" className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                                        <input required type="email" value={formState.email} onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))} placeholder="you@example.com" className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary transition-all" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Subject</label>
                                    <input required value={formState.subject} onChange={(e) => setFormState(s => ({ ...s, subject: e.target.value }))} placeholder="How can we help?" className="w-full h-12 rounded-xl border-2 border-input bg-background/50 px-4 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
                                    <textarea required value={formState.message} onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))} placeholder="Tell us more..." className="w-full min-h-[120px] rounded-xl border-2 border-input bg-background/50 px-4 py-3 text-sm font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:border-primary transition-all resize-y" />
                                </div>
                                <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary/20" icon={<Send className="h-5 w-5" />}>Send Message</Button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
