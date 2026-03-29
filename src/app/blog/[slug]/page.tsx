import { blogs } from "@/lib/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Clock, Calendar } from "lucide-react";

export function generateStaticParams() {
    return blogs.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogs.find((p) => p.slug === slug);
    if (!post) return { title: "Post Not Found" };
    
    return {
        title: `${post.title} — Taskora AI Blog`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = blogs.find((p) => p.slug === slug);

    if (!post) return notFound();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="flex items-center justify-between p-4 sm:p-6 lg:px-12 max-w-7xl mx-auto border-b border-border/10">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5 text-white" /></div>
                    <span className="text-2xl font-black tracking-tighter">Taskora AI</span>
                </Link>
                <Link href="/blog" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">← Back to Blog</Link>
            </nav>

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 animate-fade-in">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12 group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> All Posts
                </Link>

                <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                            {post.category}
                        </span>
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                            <Calendar className="h-4 w-4" /> {post.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                            <Clock className="h-4 w-4" /> {post.readTime}
                        </div>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-8 leading-[1.15]">
                        {post.title}
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                        {post.excerpt}
                    </p>
                </div>

                {/* Simulated Markdown Renderer */}
                <article className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-black prose-headings:tracking-tight 
                    prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-10
                    prose-a:text-primary prose-a:font-bold hover:prose-a:text-primary/80 
                    prose-p:leading-relaxed prose-p:text-muted-foreground/90 prose-p:font-medium
                    prose-li:text-muted-foreground/90 prose-li:font-medium">
                    <BlogContent content={post.content} />
                </article>
            </main>
        </div>
    );
}

// Simple custom renderer to parse markdown-like strings from our data
function BlogContent({ content }: { content: string }) {
    const blocks = content.trim().split(/\n\n+/);

    return (
        <div className="space-y-6">
            {blocks.map((block, index) => {
                const trimmed = block.trim();
                
                // Headings
                if (trimmed.startsWith('### ')) {
                    return <h3 key={index}>{trimmed.substring(4)}</h3>;
                }
                
                // Code blocks
                if (trimmed.startsWith('\`\`\`')) {
                    const codeMatch = trimmed.match(/\`\`\`(.*?)\n([\s\S]*?)\`\`\`/);
                    if (codeMatch) {
                        return (
                            <pre key={index} className="bg-muted p-5 rounded-2xl border border-border/50 overflow-x-auto text-sm my-8 shadow-sm">
                                <code>{codeMatch[2].trim()}</code>
                            </pre>
                        );
                    }
                }

                // Ordered Lists (primitive check)
                if (/^[0-9]\.\s/.test(trimmed)) {
                    const items = trimmed.split('\n');
                    return (
                        <ol key={index} className="list-decimal list-outside ml-5 space-y-3">
                            {items.map((item, i) => {
                                const cleanItem = item.replace(/^[0-9]\.\s/, '');
                                return <li key={i}>{cleanItem}</li>;
                            })}
                        </ol>
                    );
                }

                // Normal paragraphs
                return (
                    <p key={index}>
                        {trimmed}
                    </p>
                );
            })}
        </div>
    );
}
