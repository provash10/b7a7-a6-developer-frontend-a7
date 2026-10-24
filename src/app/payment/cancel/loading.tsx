export default function PaymentCancelLoading() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-pulse">
      <div className="rounded-3xl border border-border/60 bg-muted/20 p-10 text-center space-y-4">
        <div className="mx-auto size-20 rounded-3xl bg-muted/40" />
        <div className="h-4 w-44 mx-auto rounded-full bg-muted/40" />
        <div className="h-8 w-72 mx-auto rounded-xl bg-muted/40" />
        <div className="h-4 w-80 mx-auto rounded-lg bg-muted/30" />
      </div>

      <div className="rounded-3xl border border-border/60 bg-card p-8 space-y-4">
        <div className="h-6 w-48 rounded bg-muted/40" />
        <div className="h-20 w-full rounded bg-muted/20" />
      </div>
    </div>
  );
}
