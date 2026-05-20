export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-12 w-1/4" />
          <Skeleton className="h-12 w-1/6" />
          <Skeleton className="h-12 w-1/6" />
          <Skeleton className="h-12 w-16" />
        </div>
      ))}
    </div>
  );
}
