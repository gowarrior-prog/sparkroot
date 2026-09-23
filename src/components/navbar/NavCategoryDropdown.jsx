import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from '../../lib/routerCompat';

export default function NavCategoryDropdown({ categories, isCategoryOpen, setIsCategoryOpen }) {
  const navigate = useNavigate();

  const handleSelect = (slug) => {
    setIsCategoryOpen(false);
    navigate(`/category/${slug}`);
  };

  return (
    <div
      className={`
        absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-50 mt-2
        transition-all duration-300 ease-out transform origin-top-left
        ${isCategoryOpen 
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
          : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'
        }
      `}
    >
      <div className="px-4 py-2 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
        Browse Collections
      </div>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => handleSelect(cat.slug)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-black hover:bg-[#f4f4f6] transition-colors group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-500 group-hover:text-black transition-colors">{cat.icon}</span>
            <span>{cat.name}</span>
          </div>
          <ChevronRight size={14} className="text-gray-300 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
        </button>
      ))}
    </div>
  );
}
