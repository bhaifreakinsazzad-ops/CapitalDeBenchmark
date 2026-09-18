interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className = '', lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer h-4"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card space-y-3">
      <div className="shimmer h-6 w-3/4" />
      <div className="shimmer h-4 w-full" />
      <div className="shimmer h-4 w-2/3" />
      <div className="flex gap-2 mt-4">
        <div className="shimmer h-8 w-20" />
        <div className="shimmer h-8 w-20" />
      </div>
    </div>
  );
}
