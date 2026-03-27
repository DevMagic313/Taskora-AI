"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthFormInput } from "@/features/auth/components/AuthFormInput";
import { getSecurityQuestion, resetPasswordWithAnswer } from "@/features/auth/services/authApi";
import { Sparkles, ArrowLeft, ShieldQuestion, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleIdentify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const fetchedQuestion = await getSecurityQuestion(email);
            setQuestion(fetchedQuestion);
            setStep(2);
        } catch (err: unknown) {
            setErrorMsg((err as Error).message || "Could not find account with that email.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);
        setErrorMsg(null);
        try {
            await resetPasswordWithAnswer(email, answer, newPassword);
            setStep(3);
        } catch (err: unknown) {
            setErrorMsg((err as Error).message || "Incorrect answer or reset failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex animate-fade-in bg-background relative overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />
            
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10">
                <div className="w-full max-w-md space-y-8">
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Taskora AI</span>
                    </div>

                    <div className="space-y-3 text-center">
                        <h1 className="text-4xl font-black tracking-tight">
                            {step === 1 ? "Forgot Password?" : step === 2 ? "Security Verification" : "Password Reset!"}
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg">
                            {step === 1 ? "No worries, we'll help you get back in." : step === 2 ? "Answer your question to set a new password." : "Your account is now secure."}
                        </p>
                    </div>

                    <div className="bg-card/80 p-8 rounded-[2rem] border border-border/50 shadow-sm backdrop-blur-xl relative">
                        {step === 1 && (
                            <form onSubmit={handleIdentify} className="space-y-6">
                                <AuthFormInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errorMsg && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 animate-shake">
                                        {errorMsg}
                                    </div>
                                )}
                                <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-primary/20" size="lg">
                                    Verify Email
                                </Button>
                                <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest pt-2">
                                    <ArrowLeft className="h-3 w-3" /> Back to Login
                                </Link>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleReset} className="space-y-5">
                                <div className="space-y-2 p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-4">
                                    <div className="flex items-center gap-2 text-primary">
                                        <ShieldQuestion className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Your Security Question</span>
                                    </div>
                                    <p className="text-sm font-bold text-foreground leading-snug">{question}</p>
                                </div>

                                <AuthFormInput
                                    id="answer"
                                    label="Your Answer"
                                    type="text"
                                    placeholder="Enter the secret answer"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                />

                                <div className="pt-2 space-y-4">
                                    <AuthFormInput
                                        id="newPassword"
                                        label="New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <AuthFormInput
                                        id="confirmPassword"
                                        label="Confirm New Password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 animate-shake">
                                        {errorMsg}
                                    </div>
                                )}

                                <Button type="submit" isLoading={isLoading} className="w-full shadow-lg shadow-primary/20" size="lg">
                                    Change Password
                                </Button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest pt-2">
                                    Change Email
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center space-y-6 py-4 animate-scale-in">
                                <div className="flex justify-center">
                                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">All Set!</h3>
                                    <p className="text-muted-foreground font-medium">Your password has been updated securely. You can now login with your new credentials.</p>
                                </div>
                                <Button onClick={() => window.location.href = "/login"} className="w-full shadow-lg shadow-primary/20" size="lg">
                                    Go to Login
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
