export function LoadingSpinner({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center py-16 ${className}`}>
            <div className="relative">
                <div className="h-10 w-10 rounded-full border-4 border-muted animate-spin border-t-primary" />
            </div>
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-muted animate-spin border-t-primary" />
            </div>
        </div>
    );
}
