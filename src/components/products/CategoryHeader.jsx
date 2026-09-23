import React from 'react';

export default function CategoryHeader({ displayCategory, count }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
      <div>
        <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
          {displayCategory} <span className="text-gray-400">Collection</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          Showing luxury items curated for {displayCategory.toLowerCase()}.
        </p>
      </div>
      <span suppressHydrationWarning className="px-3.5 py-1.5 bg-black text-white text-xs font-bold rounded-full">
        {count} Items Available
      </span>
    </div>
  );
}
