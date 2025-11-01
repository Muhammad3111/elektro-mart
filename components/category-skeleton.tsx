export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-lg border bg-card animate-pulse">
          <div className="w-20 h-20 rounded-full bg-muted" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

export function CategoryListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card animate-pulse">
          <div className="w-16 h-16 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
