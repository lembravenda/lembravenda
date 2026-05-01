export default function HojeLoading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="sticky top-0 z-30 px-4 pb-3 pt-4 border-b border-border/40">
        <div className="h-7 w-32 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="flex-1 px-4 py-5 space-y-5 pb-24">
        <div className="rounded-xl h-32 bg-muted animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[14px] border border-border p-4 space-y-3">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-5 w-40 rounded bg-muted animate-pulse" />
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
