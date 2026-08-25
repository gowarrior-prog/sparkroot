export default function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-4 w-28 bg-slate-200 rounded animate-pulse mb-8" />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Skeleton Gallery */}
          <div className="flex flex-row gap-2.5 sm:gap-4 md:sticky md:top-28 w-full">
            <div className="flex flex-col gap-2 sm:gap-2.5 w-12 sm:w-16 md:w-20 flex-shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-200 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 min-h-[280px] sm:min-h-[400px] md:min-h-[480px] bg-slate-200 rounded-2xl animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
          {/* Skeleton Details */}
          <div className="space-y-5 pt-2">
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-8 w-2/5 bg-slate-200 rounded-md animate-pulse" />
            <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
            <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2.5">
              <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3 pt-4">
              <div className="h-14 w-full bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-14 w-full bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
