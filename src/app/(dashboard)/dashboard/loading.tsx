export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse pb-10">
      {/* banner skeleton */}
      <div className="h-32 rounded-2xl bg-muted/60" />

      {/* stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/50" />
        ))}
      </div>

      {/* active assessment skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-48 bg-muted/70 rounded" />
        <div className="h-44 rounded-xl bg-muted/50" />
      </div>

      {/* history grid skeleton */}
      <div className="space-y-3">
        <div className="h-6 w-52 bg-muted/70 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    </div>
  );
}
