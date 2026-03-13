import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://taskora.ai";
    const now = new Date();

    const publicPages = [
        { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
        { path: "/features", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
        { path: "/ai-engine", priority: 0.8, changeFrequency: "monthly" as const },
        { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
        { path: "/careers", priority: 0.6, changeFrequency: "monthly" as const },
        { path: "/contact", priority: 0.7, changeFrequency: "yearly" as const },
        { path: "/changelog", priority: 0.6, changeFrequency: "weekly" as const },
        { path: "/integrations", priority: 0.7, changeFrequency: "monthly" as const },
        { path: "/login", priority: 0.5, changeFrequency: "yearly" as const },
        { path: "/register", priority: 0.6, changeFrequency: "yearly" as const },
        { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
        { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
        { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
        { path: "/gdpr", priority: 0.2, changeFrequency: "yearly" as const },
    ];

    return publicPages.map((page) => ({
        url: `${siteUrl}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
