import { Suspense } from 'react';
import Search from '../../Search';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 text-center text-slate-500 font-medium">Loading search results...</div>}>
      <Search />
    </Suspense>
  );
}
