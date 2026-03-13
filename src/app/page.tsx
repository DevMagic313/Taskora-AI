"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles, ArrowRight, Activity, Brain, Shield, Zap, Terminal, Layers,
  Check, Star, Twitter, Github, Linkedin, Mail, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LandingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

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
                      text: "Yes, Taskora AI offers a free Starter plan with up to 50 tasks and basic AI generation. Paid plans are coming soon.",
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
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none mix-blend-overlay animate-float" style={{ animationDelay: '-2s' }} />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-10 relative z-10 -mt-10">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(var(--primary),0.2)] backdrop-blur-md animate-slide-up hover:border-primary/50 hover:bg-primary/20 transition-all duration-300">
                <Sparkles className="h-3.5 w-3.5" /> Generative AI Powered
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[6.5rem] font-extrabold tracking-tight leading-[1.05] animate-slide-up text-balance" style={{ animationDelay: '100ms' }}>
              Think big. <br className="hidden sm:block" /> Let AI handle the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-shimmer bg-[length:200%_auto] pb-2 inline-block">execution.</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto font-normal leading-relaxed text-balance animate-slide-up" style={{ animationDelay: '200ms' }}>
              Taskora AI is an enterprise-grade task manager that transforms your monumental goals into actionable, byte-sized roadmaps in seconds using cutting-edge LLMs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up pt-4" style={{ animationDelay: '300ms' }}>
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

            <div className="pt-16 sm:pt-24 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="glass rounded-[2rem] p-6 sm:p-8 border border-border/40 max-w-4xl mx-auto shadow-2xl">
                <div className="flex flex-wrap items-center justify-around gap-8 sm:gap-12">
                  {[
                    { value: "10K+", label: "Tasks Created" },
                    { value: "500+", label: "Active Users" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "50ms", label: "Avg Request" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center group cursor-default">
                      <div className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text transition-transform duration-300 group-hover:scale-110">{stat.value}</div>
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

        {/* Pricing */}
        <section className="py-16 sm:py-24 relative z-10 overflow-hidden">
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
                features={["Up to 50 tasks", "Basic AI generation", "Email support", "1 workspace"]}
                buttonText="Get Started"
                onButtonClick={() => router.push('/register')}
              />
              <PricingCard
                name="Pro"
                price="$12"
                period="/month"
                description="For power users and small teams."
                features={["Unlimited tasks", "Advanced AI with GPT-4", "Priority support", "10 workspaces", "Analytics dashboard", "Custom categories"]}
                buttonText="Coming Soon"
                onButtonClick={() => { }}
                featured
                comingSoon
              />
              <PricingCard
                name="Team"
                price="$49"
                period="/month"
                description="For organizations that need full control."
                features={["Everything in Pro", "Unlimited workspaces", "SSO & SAML", "Dedicated support", "Custom integrations", "SLA guarantee", "Admin controls"]}
                buttonText="Coming Soon"
                onButtonClick={() => { }}
                comingSoon
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 sm:py-24 bg-card/50 border-y border-border/40 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-6">Loved by builders.</h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">See what developers and teams are saying about Taskora AI.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              <TestimonialCard
                quote="Taskora AI completely transformed how we plan sprints. The AI breakdown feature is insanely accurate. Saves us hours every week."
                name="Sarah Chen"
                role="Engineering Lead at Vercel"
                rating={5}
              />
              <TestimonialCard
                quote="I've tried dozens of task managers. Taskora is the first one that actually understands what I need to build and gives me a real plan."
                name="Marcus Rivera"
                role="Full-Stack Developer"
                rating={5}
              />
              <TestimonialCard
                quote="The optimistic UI is buttery smooth. Combined with the AI task generation, it's the most productive tool in my stack right now."
                name="Aisha Patel"
                role="CTO at DevScale"
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-32 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 glass rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 lg:p-24 border border-border/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-[2rem] sm:rounded-[3rem] pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
              Ready to ship faster?
            </h2>
            <Button size="lg" onClick={() => router.push('/register')} className="text-lg h-14 sm:h-16 w-full sm:w-auto px-10 sm:px-12 shadow-2xl shadow-primary/30" icon={<ArrowRight className="h-6 w-6" />}>
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

/* ─── Sub-Components ─── */

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group bg-background rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden">
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
    <div className="group bg-background rounded-3xl p-6 sm:p-8 border border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
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
