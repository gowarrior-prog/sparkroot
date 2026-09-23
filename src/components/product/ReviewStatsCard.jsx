import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewStatsCard({ avgRating, totalReviews, reviews }) {
  return (
    <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      <div className="text-center md:text-left md:border-r border-slate-200/80 md:pr-6">
        <div className="flex items-baseline justify-center md:justify-start gap-2">
          <span className="text-5xl font-extrabold text-black tracking-tight">{avgRating}</span>
          <span className="text-slate-400 font-medium text-lg">/ 5.0</span>
        </div>
        <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1 my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              className={star <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
            />
          ))}
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Based on {totalReviews} verified {totalReviews === 1 ? 'customer review' : 'customer reviews'}
        </p>
      </div>

      <div className="md:col-span-2 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = reviews.filter((r) => r.rating === stars).length;
          const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : stars === 5 ? 100 : 0;
          return (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-slate-600 font-semibold">{stars} Stars</span>
              <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-400 font-medium">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
