"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, Activity, Brain, Shield, Zap, Terminal, Layers,
  Check, Star, Twitter, Github, Linkedin, Mail, Clock,
  CheckCircle2, Target,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

const HERO_DELAYS = ["delay-100", "delay-200", "delay-300", "delay-400", "delay-500"] as const;
const STEP_DELAYS = ["delay-0", "delay-150", "delay-300"] as const;
const SPARKLE_DELAYS = ["delay-0", "delay-500", "delay-1000", "delay-700"] as const;

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = target / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, startOnView]);

  return { count, ref };
}

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const stat1 = useCountUp(10000);
  const stat2 = useCountUp(500);
  const stat3 = useCountUp(999);
  const stat4 = useCountUp(50);

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in overflow-hidden relative selection:bg-primary/30">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "Taskora AI",
                url: "https://taskora.ai",
                logo: "https://taskora.ai/icon.svg",
                description: "AI-powered task management suite for high-performance individuals and teams.",
                sameAs: [],
              },
              {
                "@type": "WebApplication",
                name: "Taskora AI",
                url: "https://taskora.ai",
                applicationCategory: "ProductivityApplication",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
                description: "Break down goals into actionable tasks using cutting-edge AI. Built for high-performance teams.",
              },
              {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is Taskora AI?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Taskora AI is an enterprise-grade task manager that transforms your goals into actionable roadmaps using cutting-edge LLMs.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Taskora AI free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. Taskora AI offers a free Starter plan with 15 AI generations per month, and paid plans unlock much higher limits.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How does the AI task generation work?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Describe your goal and Taskora AI uses Groq-powered LLMs to break it down into specific, prioritized tasks with estimated hours and dependencies.",
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />
      <div className="absolute inset-0 z-0 bg-grid-pattern opacity-[0.15] pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto border-b border-border/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Taskora AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-9 w-24 bg-muted animate-pulse rounded-lg" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground hidden sm:block">
                Welcome back, {user.name?.split(" ")[0]}
              </span>
              <Button onClick={() => router.push('/dashboard')} className="shadow-lg shadow-primary/20" size="sm">
                Dashboard
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors hidden sm:block uppercase tracking-wider">
                Sign In
              </Link>
              <Button onClick={() => router.push('/register')} className="shadow-lg shadow-primary/20" size="sm">
                Get Started Free
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10">
        <section className="relative min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden pb-12 sm:pb-24 pt-10 sm:pt-16">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] lg:h-[800px] lg:w-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-overlay animate-float" />
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none mix-blend-overlay animate-float delay-neg-2s" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-10 relative z-10 -mt-10">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.2)] backdrop-blur-md animate-slide-up hover:border-primary/50 hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="h-3.5 w-3.5" /> Generative AI Powered
              </div>
            </div>

            <h1 className={`text-5xl sm:text-7xl lg:text-[6.5rem] font-extrabold tracking-tight leading-[1.05] animate-slide-up text-balance ${HERO_DELAYS[0]}`}>
              Think big. <br className="hidden sm:block" /> Let AI handle the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-shimmer bg-[length:200%_auto] pb-2 inline-block">execution.</span>
            </h1>

            <p className={`text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-normal leading-relaxed text-balance animate-slide-up ${HERO_DELAYS[1]}`}>
              Taskora AI is an enterprise-grade task manager that transforms your monumental goals into actionable, byte-sized roadmaps in seconds using cutting-edge LLMs.
            </p>

            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up pt-4 ${HERO_DELAYS[2]}`}>
              {isLoading ? (
                <Button size="lg" disabled className="w-full sm:w-auto text-lg h-14 px-8 rounded-[1.25rem] opacity-50 cursor-not-allowed">
                  Loading...
                </Button>
              ) : user ? (
                <Button size="lg" onClick={() => router.push('/dashboard')} className="w-full sm:w-auto text-lg h-14 px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 rounded-[1.25rem]" icon={<ArrowRight className="h-5 w-5" />}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => router.push('/register')} className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 rounded-[1.25rem]" icon={<ArrowRight className="h-5 w-5" />}>
                    Start Building Free
                  </Button>
                  <Button size="lg" variant="secondary" onClick={() => router.push('/login')} className="w-full sm:w-auto text-lg h-14 px-8 border-2 border-border/50 hover:border-foreground/20 hover:bg-muted hover:-translate-y-1 transition-all duration-300 rounded-[1.25rem]">
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* ─── Interactive Mock Dashboard Preview ─── */}
            <div className={`pt-16 sm:pt-24 animate-slide-up ${HERO_DELAYS[3]}`}>
              <div className="glass rounded-[2rem] p-4 sm:p-6 border border-border/40 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none rounded-[2rem]" />
                
                {/* Mini browser chrome */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <div className="flex-1 h-6 rounded-lg bg-muted/60 mx-8 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-muted-foreground/60">taskora.ai/dashboard</span>
                  </div>
                </div>

                {/* Mock dashboard content */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Tasks", value: "24", color: "from-blue-500/20 to-blue-500/5" },
                    { label: "Done", value: "18", color: "from-emerald-500/20 to-emerald-500/5" },
                    { label: "Active", value: "6", color: "from-amber-500/20 to-amber-500/5" },
                    { label: "AI Gen", value: "12", color: "from-purple-500/20 to-purple-500/5" },
                  ].map((card) => (
                    <div key={card.label} className={`rounded-xl bg-gradient-to-b ${card.color} border border-border/30 p-3 text-center`}>
                      <p className="text-lg sm:text-xl font-black">{card.value}</p>
                      <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* Mock task list */}
                <div className="space-y-2">
                  {[
                    { title: "Design system audit", priority: "high", done: true },
                    { title: "API integration tests", priority: "medium", done: false },
                    { title: "Deploy staging build", priority: "high", done: false },
                  ].map((task) => (
                    <div key={task.title} className={`flex items-center gap-3 rounded-xl border border-border/30 p-3 ${task.done ? "opacity-50" : ""}`}>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${task.done ? "bg-emerald-500/20 text-emerald-500" : "border-2 border-border"}`}>
                        {task.done && <Check className="h-3 w-3" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium flex-1 ${task.done ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        task.priority === "high" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                      }`}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ─── Animated Stats ─── */}
            <div className={`pt-8 sm:pt-12 animate-slide-up ${HERO_DELAYS[4]}`}>
              <div className="glass rounded-[2rem] p-6 sm:p-8 border border-border/40 max-w-4xl mx-auto shadow-xl">
                <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-12">
                  {[
                    { ref: stat1.ref, count: stat1.count, suffix: "+", label: "Tasks Created" },
                    { ref: stat2.ref, count: stat2.count, suffix: "+", label: "Active Users" },
                    { ref: stat3.ref, count: stat3.count, suffix: "%", label: "Uptime", divide: 10 },
                    { ref: stat4.ref, count: stat4.count, suffix: "ms", label: "Avg Request" },
                  ].map((stat) => (
                    <div key={stat.label} ref={stat.ref} className="text-center group cursor-default">
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text transition-transform duration-300 group-hover:scale-110 tabular-nums">
                        {stat.divide ? (stat.count / stat.divide).toFixed(1) : stat.count.toLocaleString()}{stat.suffix}
                      </div>
                      <div className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24 bg-card/50 border-y border-border/40 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Built for velocity.</h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">Stop wasting time planning. Describe what you want to achieve and start crossing off tasks instantly.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard icon={<Brain className="h-8 w-8" />} title="Groq AI Engine" description="Powered by cutting-edge LLMs, breaking down complex queries into sub-tasks instantly." />
              <FeatureCard icon={<Zap className="h-8 w-8" />} title="Optimistic UI Updates" description="Experience zero latency. Changes to your tasks reflect instantly while syncing in the background." />
              <FeatureCard icon={<Activity className="h-8 w-8" />} title="Advanced Analytics" description="Real-time visualizations of your productivity trends, priority matrices, and completion rates." />
              <FeatureCard icon={<Shield className="h-8 w-8" />} title="Enterprise Security" description="Supabase Auth with Row Level Security keeps your planning data completely private." />
              <FeatureCard icon={<Terminal className="h-8 w-8" />} title="Developer First" description="Clean REST APIs, strict TypeScript definitions, and robust serverless architecture." />
              <FeatureCard icon={<Layers className="h-8 w-8" />} title="Multi-Platform" description="Fully responsive design that works beautifully on desktop, tablet, and mobile devices." />
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="py-16 sm:py-24 relative z-10 overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-accent/8 blur-[120px] pointer-events-none -translate-y-1/2" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                <Target className="h-4 w-4" /> How It Works
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Three steps to productivity.</h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">Transform any goal into an actionable roadmap in under 30 seconds.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

              {[
                { step: "01", title: "Describe", desc: "Tell Taskora AI what you want to achieve. Be as detailed or brief as you like.", icon: <AlignLeft className="h-6 w-6" />, color: "from-blue-500 to-blue-600" },
                { step: "02", title: "AI Generates", desc: "Our Groq-powered engine breaks your goal into prioritized, actionable sub-tasks.", icon: <Sparkles className="h-6 w-6" />, color: "from-primary to-accent" },
                { step: "03", title: "Execute", desc: "Track progress, collaborate with your team, and ship faster than ever before.", icon: <CheckCircle2 className="h-6 w-6" />, color: "from-emerald-500 to-emerald-600" },
              ].map((item, i) => (
                <div key={item.step} className={`flex flex-col items-center text-center group animate-slide-up ${STEP_DELAYS[i]}`}>
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg mb-6 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-translate-y-1 relative z-10`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">{item.step}</span>
                  <h3 className="text-xl font-bold tracking-tight mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 sm:py-24 bg-card/50 border-y border-border/40 relative z-10 overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-bold tracking-wide uppercase shadow-sm mb-6">
                <Sparkles className="h-4 w-4" /> Simple Pricing
              </div>
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Plans that scale with you.</h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">Start free. Upgrade when you need more power. No hidden fees, cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <PricingCard
                name="Starter"
                price="Free"
                description="Perfect for individuals getting started."
                features={["Up to 50 tasks", "15 AI generations / month", "Email support", "1 workspace"]}
                buttonText="Get Started"
                onButtonClick={() => router.push('/register')}
              />
              <PricingCard
                name="Pro"
                price="$12"
                period="/month"
                description="For power users and small teams."
                features={["Unlimited tasks", "250 AI generations / month", "Priority support", "10 workspaces", "Analytics dashboard", "Custom categories"]}
                buttonText="Choose Pro"
                onButtonClick={() => router.push('/pricing')}
                featured
              />
              <PricingCard
                name="Team"
                price="$49"
                period="/month"
                description="For organizations that need full control."
                features={["Everything in Pro", "1,500 AI generations / month", "Unlimited workspaces", "Dedicated support", "Custom integrations", "Admin controls"]}
                buttonText="Choose Team"
                onButtonClick={() => router.push('/pricing')}
              />
            </div>
          </div>
        </section>

        {/* Testimonials — Auto-scrolling */}
        <section className="py-16 sm:py-24 relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Loved by builders.</h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">See what developers and teams are saying about Taskora AI.</p>
            </div>

            {/* Auto-scrolling marquee */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max-content">
                  {/* Duplicate for seamless loop */}
                  {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                    <TestimonialCard key={`${t.name}-${i}`} quote={t.quote} name={t.name} role={t.role} rating={t.rating} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA — With sparkle effect */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 glass rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-24 border border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5 rounded-[2rem] sm:rounded-[3rem] pointer-events-none" />
            {/* Animated sparkles */}
            <div className={`absolute top-8 left-12 text-primary/30 animate-sparkle ${SPARKLE_DELAYS[0]}`}><Sparkles className="h-4 w-4" /></div>
            <div className={`absolute top-16 right-16 text-accent/30 animate-sparkle ${SPARKLE_DELAYS[1]}`}><Sparkles className="h-5 w-5" /></div>
            <div className={`absolute bottom-12 left-20 text-primary/20 animate-sparkle ${SPARKLE_DELAYS[2]}`}><Sparkles className="h-3 w-3" /></div>
            <div className={`absolute bottom-20 right-24 text-accent/20 animate-sparkle ${SPARKLE_DELAYS[3]}`}><Sparkles className="h-6 w-6" /></div>

            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground relative z-10">
              Ready to ship faster?
            </h2>
            <Button size="lg" onClick={() => router.push('/register')} className="text-lg h-14 sm:h-16 w-full sm:w-auto px-10 sm:px-12 shadow-2xl shadow-primary/30 relative z-10" icon={<ArrowRight className="h-6 w-6" />}>
              Create Your Free Account
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm shadow-primary/20">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-black tracking-tighter">Taskora AI</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                AI-powered task management for high-performance teams & individuals.
              </p>
              <div className="flex items-center gap-3">
                <SocialIcon icon={<Twitter className="h-4 w-4" />} href="#" />
                <SocialIcon icon={<Github className="h-4 w-4" />} href="#" />
                <SocialIcon icon={<Linkedin className="h-4 w-4" />} href="#" />
                <SocialIcon icon={<Mail className="h-4 w-4" />} href="#" />
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <FooterLink href="/features" label="Features" />
                <FooterLink href="/pricing" label="Pricing" />
                <FooterLink href="/ai-engine" label="AI Engine" />
                <FooterLink href="/integrations" label="Integrations" />
                <FooterLink href="/changelog" label="Changelog" />
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                <FooterLink href="/about" label="About" />
                <FooterLink href="/blog" label="Blog" />
                <FooterLink href="/careers" label="Careers" />
                <FooterLink href="/contact" label="Contact" />
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <FooterLink href="/privacy" label="Privacy Policy" />
                <FooterLink href="/terms" label="Terms of Service" />
                <FooterLink href="/cookies" label="Cookie Policy" />
                <FooterLink href="/gdpr" label="GDPR" />
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium text-muted-foreground">&copy; 2026 Taskora AI Workspace. All rights reserved.</p>
            <p className="text-sm font-medium text-muted-foreground">Designed for high performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Constants ─── */

const TESTIMONIALS = [
  { quote: "Taskora AI completely transformed how we plan sprints. The AI breakdown feature is insanely accurate. Saves us hours every week.", name: "Sarah Chen", role: "Engineering Lead at Vercel", rating: 5 },
  { quote: "I've tried dozens of task managers. Taskora is the first one that actually understands what I need to build and gives me a real plan.", name: "Marcus Rivera", role: "Full-Stack Developer", rating: 5 },
  { quote: "The optimistic UI is buttery smooth. Combined with the AI task generation, it's the most productive tool in my stack right now.", name: "Aisha Patel", role: "CTO at DevScale", rating: 5 },
  { quote: "We onboarded our entire 20-person team in under an hour. The AI generates sprint plans that actually make sense.", name: "James Okoye", role: "VP Engineering at Stripe", rating: 5 },
  { quote: "Best developer experience I've seen in a task manager. The keyboard shortcuts and optimistic updates make it feel native.", name: "Elena Volkov", role: "Senior SRE at Cloudflare", rating: 5 },
  { quote: "Taskora's AI doesn't just list tasks — it understands dependencies and gives you a real execution plan. Game changer.", name: "David Kim", role: "Product Lead at Linear", rating: 5 },
];

/* ─── Sub-Components ─── */

function AlignLeft(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="17" x2="3" y1="10" y2="10"></line><line x1="21" x2="3" y1="6" y2="6"></line><line x1="21" x2="3" y1="14" y2="14"></line><line x1="17" x2="3" y1="18" y2="18"></line>
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-background rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden card-tilt">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-muted border border-border/50 text-foreground flex items-center justify-center mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-3 transition-colors group-hover:text-primary">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name, price, period, description, features, buttonText, onButtonClick, featured, comingSoon,
}: {
  name: string; price: string; period?: string; description: string;
  features: string[]; buttonText: string; onButtonClick: () => void; featured?: boolean; comingSoon?: boolean;
}) {
  return (
    <div className={`relative group rounded-3xl border p-1 transition-all duration-300 hover:-translate-y-1 ${featured
      ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]"
      : "border-border/50 shadow-sm hover:shadow-lg hover:border-primary/20"
      }`}>
      {featured && !comingSoon && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-primary/30 uppercase tracking-wider">
            <Star className="h-3 w-3 fill-current" /> Most Popular
          </span>
        </div>
      )}
      {comingSoon && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted border border-border px-4 py-1.5 text-xs font-bold text-muted-foreground shadow-sm uppercase tracking-wider">
            <Clock className="h-3 w-3" /> Coming Soon
          </span>
        </div>
      )}
      <div className={`h-full rounded-[1.35rem] p-6 sm:p-8 flex flex-col ${featured && !comingSoon ? "bg-gradient-to-b from-primary/5 to-background" : "bg-background"} ${comingSoon ? "opacity-70" : ""}`}>
        <h3 className="text-lg font-bold tracking-tight">{name}</h3>
        <p className="text-sm text-muted-foreground font-medium mt-1">{description}</p>
        <div className="mt-6 mb-6">
          <span className="text-4xl sm:text-5xl font-black tracking-tighter">{price}</span>
          {period && <span className="text-muted-foreground font-medium text-sm">{period}</span>}
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm font-medium text-foreground">
              <div className={`flex h-5 w-5 items-center justify-center rounded-full ${featured && !comingSoon ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                <Check className="h-3 w-3" />
              </div>
              {f}
            </li>
          ))}
        </ul>
        <Button
          onClick={onButtonClick}
          variant={comingSoon ? "secondary" : featured ? "primary" : "outline"}
          className={`w-full ${featured && !comingSoon ? "shadow-lg shadow-primary/20" : ""}`}
          disabled={comingSoon}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role, rating }: { quote: string; name: string; role: string; rating: number }) {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-background rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <blockquote className="text-sm sm:text-base text-foreground leading-relaxed font-medium mb-6">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold shadow-sm shadow-primary/20">
            {name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground font-medium">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5">
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        {label}
      </Link>
    </li>
  );
}
