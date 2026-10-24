export default function RecruiterDashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-10">
      {/* Header Banner Skeleton */}
      <div className="h-28 rounded-2xl bg-muted/60" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/50" />
        ))}
      </div>

      {/* Evaluations Queue Skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-56 bg-muted/70 rounded" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
