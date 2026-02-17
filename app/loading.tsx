export default function Loading() {
    return (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-background/65 backdrop-blur-[1px]">
            <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-primary/20 bg-background/95 px-4 py-3 shadow-xl"
            >
                <div className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                    <span className="text-sm font-medium text-foreground">
                        Loading...
                    </span>
                </div>
            </div>
        </div>
    );
}
