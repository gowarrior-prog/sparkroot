export default function OrdersSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="h-4 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 bg-slate-200 rounded-lg animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-1/4 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
