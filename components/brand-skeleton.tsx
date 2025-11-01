export function BrandSkeleton() {
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
