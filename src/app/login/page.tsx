"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFormInput } from "@/features/auth/components/AuthFormInput";
import { loginApi } from "@/features/auth/services/authApi";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { setUser } = useAuth();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const response = await loginApi(email, password);
            if (response.user) {
                setUser({
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                });
                router.push("/dashboard");
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to login. Please try again.";
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
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-overlay animate-float" />
                    <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-accent/20 blur-[150px] mix-blend-overlay animate-float [animation-delay:-3s]" />
                </div>

                <div className="absolute top-20 right-20 w-48 h-48 rounded-full border border-primary/10 animate-pulse-slow pointer-events-none" />
                <div className="absolute bottom-32 left-16 w-32 h-32 rounded-full border border-accent/10 animate-pulse-slow pointer-events-none [animation-delay:-1.5s]" />

                <div className="relative text-foreground space-y-8 max-w-xl z-10 glass p-10 rounded-[2.5rem] shadow-xl border border-border/50">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Taskora AI</span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15]">
                        Supercharge your productivity workflow.
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed font-medium max-w-md">
                        The ultimate intelligent task management suite for high-performance individuals and teams.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4 border border-border/50 transition-all duration-300 hover:bg-muted hover:border-border/80 hover:-translate-y-0.5">
                            <Zap className="h-6 w-6 text-amber-500 mb-2" />
                            <h4 className="font-bold text-sm">Lightning Fast</h4>
                            <p className="text-xs text-muted-foreground">Optimistic UI for instant updates.</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-2xl bg-muted/60 p-4 border border-border/50 transition-all duration-300 hover:bg-muted hover:border-border/80 hover:-translate-y-0.5">
                            <ShieldCheck className="h-6 w-6 text-emerald-500 mb-2" />
                            <h4 className="font-bold text-sm">Enterprise Grade</h4>
                            <p className="text-xs text-muted-foreground">Secure architecture by design.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 z-10 bg-background/50 backdrop-blur-3xl lg:backdrop-blur-none">
                <div className="w-full max-w-md space-y-10">
                    <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-black text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Taskora AI</span>
                    </div>

                    <div className="space-y-3 text-center lg:text-left">
                        <h1 className="text-4xl font-black tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground font-medium text-lg">Enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-5 bg-card/80 p-8 rounded-[2rem] border border-border/50 shadow-sm backdrop-blur-xl">
                        <AuthFormInput
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <AuthFormInput
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="flex justify-end px-1">
                            <Link 
                                href="/forgot-password" 
                                className="text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {errorMsg && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600 shadow-sm flex items-center gap-2 animate-shake dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/50">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                {errorMsg}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                className="w-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                size="lg"
                                icon={!isLoading ? <ArrowRight className="h-5 w-5" /> : undefined}
                            >
                                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wide ml-1 border-b-2 border-primary/20 hover:border-primary">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
