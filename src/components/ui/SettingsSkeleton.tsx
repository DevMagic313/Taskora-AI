"use client";

function SkeletonBox({ className = "" }: { className?: string }) {
    return <div className={`animate-skeleton rounded-lg ${className}`} />;
}

export function SettingsFormSkeleton() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <SkeletonBox className="h-7 w-40 mb-2" />
                <SkeletonBox className="h-4 w-72" />
            </div>

            {/* Card skeleton */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <SkeletonBox className="h-5 w-32" />
                <div className="space-y-4">
                    <div>
                        <SkeletonBox className="h-4 w-24 mb-2" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                    <div>
                        <SkeletonBox className="h-4 w-28 mb-2" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                    <div>
                        <SkeletonBox className="h-4 w-20 mb-2" />
                        <SkeletonBox className="h-24 w-full" />
                    </div>
                </div>
            </div>

            {/* Second card skeleton */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-5">
                <SkeletonBox className="h-5 w-36" />
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <SkeletonBox className="h-4 w-20 mb-2" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                    <div>
                        <SkeletonBox className="h-4 w-24 mb-2" />
                        <SkeletonBox className="h-10 w-full" />
                    </div>
                </div>
            </div>

            {/* Button */}
            <SkeletonBox className="h-10 w-28" />
        </div>
    );
}

export function SettingsToggleSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
                <SkeletonBox className="h-7 w-40 mb-2" />
                <SkeletonBox className="h-4 w-72" />
            </div>
            <div className="rounded-xl border border-border bg-card p-6 space-y-1">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-3">
                            <SkeletonBox className="h-9 w-9 rounded-lg" />
                            <div>
                                <SkeletonBox className="h-4 w-28 mb-1.5" />
                                <SkeletonBox className="h-3 w-48" />
                            </div>
                        </div>
                        <SkeletonBox className="h-6 w-11 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SettingsTableSkeleton({ rows = 4 }: { rows?: number }) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
                <SkeletonBox className="h-7 w-40 mb-2" />
                <SkeletonBox className="h-4 w-72" />
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
                {/* Table header */}
                <div className="flex gap-4 pb-4 border-b border-border mb-4">
                    <SkeletonBox className="h-4 w-16" />
                    <SkeletonBox className="h-4 w-32 flex-1" />
                    <SkeletonBox className="h-4 w-24" />
                    <SkeletonBox className="h-4 w-20" />
                </div>
                {/* Table rows */}
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3">
                        <SkeletonBox className="h-9 w-9 rounded-full" />
                        <SkeletonBox className="h-4 w-36 flex-1" />
                        <SkeletonBox className="h-4 w-24" />
                        <SkeletonBox className="h-8 w-20 rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
