import React from 'react';
import { X, ChevronRight, User, Home, Mail } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function NavMobileMenu({ isMobileCategoryOpen, setIsMobileCategoryOpen, categories, user, navigate }) {
  if (!isMobileCategoryOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileCategoryOpen(false)}
      />

      <aside className="fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between animate-category-slide-left overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
                <User size={16} />
              </div>
              <span className="font-extrabold text-sm uppercase tracking-wider">
                {user ? user.name : 'SparkRoot Guest'}
              </span>
            </div>

            <button
              onClick={() => setIsMobileCategoryOpen(false)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Quick Nav Links (HOME & CONTACT) */}
          <div className="p-4 border-b border-gray-100 bg-[#f4f4f6] space-y-2">
            <Link
              to="/"
              onClick={() => setIsMobileCategoryOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-900 bg-white border border-gray-200 hover:bg-black hover:text-white transition shadow-2xs"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setIsMobileCategoryOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-slate-900 bg-white border border-gray-200 hover:bg-black hover:text-white transition shadow-2xs"
            >
              <Mail size={18} />
              <span>Contact Us</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="p-4 space-y-1">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2">
              Browse Categories
            </h4>

            <Link
              to="/category/all"
              onClick={() => setIsMobileCategoryOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 transition"
            >
              <span>All Products Collection</span>
              <ChevronRight size={16} />
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setIsMobileCategoryOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#f4f4f6] hover:text-black transition group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-black transition">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-black" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Account Link */}
        <div className="p-4 border-t border-gray-100 bg-[#f4f4f6] space-y-2">
          {user ? (
            <button
              onClick={() => {
                setIsMobileCategoryOpen(false);
                navigate('/my-orders');
              }}
              className="w-full py-3 bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              My Account Dashboard
            </button>
          ) : (
            <Link
              to="/signin"
              onClick={() => setIsMobileCategoryOpen(false)}
              className="w-full block text-center py-3 bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider"
            >
              Sign In to Account
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
}