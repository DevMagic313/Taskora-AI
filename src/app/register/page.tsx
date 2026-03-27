"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFormInput } from "@/features/auth/components/AuthFormInput";
import { registerApi } from "@/features/auth/services/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sparkles, ArrowRight, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SECURITY_QUESTIONS = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "In what city were you born?",
    "What is your favorite book?",
];

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityQuestion, setSecurityQuestion] = useState(SECURITY_QUESTIONS[0]);
    const [securityAnswer, setSecurityAnswer] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const { setUser } = useAuth();
    const router = useRouter();

    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: "", color: "" };
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
        if (score <= 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
        if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
        if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
        return { score: 5, label: "Excellent", color: "bg-emerald-500" };
    }, [password]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerApi(name, email, password, securityQuestion, securityAnswer);

            // Email confirmation required — show message, don't redirect
            if (response.emailConfirmationRequired) {
                setSuccessMsg(response.message);
                return;
            }

            if (response.user) {
                setUser({
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                });
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to create account. Please try again.";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex animate-fade-in bg-background relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-grid-pattern opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />

            {/* Left Side - Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-card items-center justify-center p-12 overflow-hidden border-r border-border/40 z-10 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px] mix-blend-overlay animate-float" />
                    <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-primary/20 blur-[150px] mix-blend-overlay animate-float [animation-delay:-3s]" />
                </div>

                <div className="absolute top-16 left-20 w-40 h-40 rounded-full border border-accent/10 animate-pulse-slow pointer-events-none" />
                <div className="absolute bottom-24 right-16 w-56 h-56 rounded-full border border-primary/10 animate-pulse-slow pointer-events-none [animation-delay:-1.5s]" />

                <div className="relative text-foreground space-y-8 max-w-xl z-10 glass p-10 rounded-[2.5rem] shadow-xl border border-border/50">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary shadow-lg shadow-accent/30">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">Taskora AI</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                        Start your productivity journey today.
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium max-w-lg">
                        Create a free account to unlock AI-powered task management, advanced analytics, and smart notifications.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4 border border-border/50 transition-all duration-300 hover:bg-muted hover:border-border/80 hover:-translate-y-0.5">
                            <Activity className="h-6 w-6 text-pink-500 mb-2" />
                            <h4 className="font-bold text-sm">Deep Insights</h4>
                            <p className="text-xs text-muted-foreground">Track historical completion rates.</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4 border border-border/50 transition-all duration-300 hover:bg-muted hover:border-border/80 hover:-translate-y-0.5">
                            <Users className="h-6 w-6 text-blue-500 mb-2" />
                            <h4 className="font-bold text-sm">Organize Life</h4>
                            <p className="text-xs text-muted-foreground">Prioritize tasks efficiently.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10 bg-background/50 backdrop-blur-3xl lg:backdrop-blur-none">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Taskora AI</span>
                    </div>

                    <div className="space-y-3 text-center lg:text-left">
                        <h1 className="text-4xl font-black tracking-tight">Create account</h1>
                        <p className="text-muted-foreground font-medium text-lg">Sign up to get started immediately.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4 bg-card/80 p-8 rounded-[2rem] border border-border/50 shadow-sm backdrop-blur-xl">
                        <AuthFormInput
                            id="name"
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <AuthFormInput
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="space-y-2">
                            <AuthFormInput
                                id="password"
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {password && (
                                <div className="flex items-center gap-2 px-1 animate-scale-in">
                                    <div className="flex-1 flex gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength.score ? passwordStrength.color : "bg-muted"}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                        {passwordStrength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <AuthFormInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <div className="space-y-2">
                            <label htmlFor="securityQuestion" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 ml-1">
                                Security Question
                            </label>
                            <select
                                id="securityQuestion"
                                value={securityQuestion}
                                onChange={(e) => setSecurityQuestion(e.target.value)}
                                className="w-full rounded-2xl border-2 border-input bg-background px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none transition-all"
                                required
                            >
                                {SECURITY_QUESTIONS.map((q) => (
                                    <option key={q} value={q}>{q}</option>
                                ))}
                            </select>
                        </div>

                        <AuthFormInput
                            id="securityAnswer"
                            label="Security Answer"
                            type="text"
                            placeholder="Your secret answer"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            required
                        />

                        {errorMsg && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 shadow-sm flex items-center gap-2 animate-shake dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 shadow-sm flex items-center gap-2 animate-scale-in dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/50">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                {successMsg}
                            </div>
                        )}

                        <div className="pt-4">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                size="lg"
                                icon={!isLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
                            >
                                {isLoading ? "Creating account..." : "Start Productivity Journey"}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide ml-1 border-b-2 border-primary/20 hover:border-primary">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
