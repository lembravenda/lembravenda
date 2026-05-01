export default function CobrancasLoading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <div className="flex-1 px-4 py-5 space-y-4 pb-24">
        <div className="rounded-xl h-28 bg-muted animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-[14px] border border-border p-4 space-y-3">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="h-5 w-40 rounded bg-muted animate-pulse" />
            <div className="h-6 w-28 rounded bg-muted animate-pulse" />
            <div className="h-10 w-36 rounded-[10px] bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
