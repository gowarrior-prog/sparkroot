import React from 'react';
import { Diamond, ArrowRight } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function LuxeMosaic() {
  return (
    <div className="pt-14 sm:pt-24 pb-12 sm:pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-50 text-slate-700 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] border border-slate-200">
            <Diamond size={12} className="text-amber-600 shrink-0" />
            <span>THE SPARKROOT EXPERIENCE</span>
          </div>

          <h2 className="text-2xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-black">
            Where <span className="italic font-normal text-slate-400">Artistry</span> Meets Elegance
          </h2>

          <p className="text-slate-500 text-xs sm:text-base font-light leading-relaxed max-w-xl mx-auto px-2 sm:px-0">
            Each piece is a conversation between heritage craftsmanship and contemporary design, made for those who appreciate the extraordinary.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <Link
            to="/category/jewelry"
            className="col-span-2 row-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer block opacity-100 visible"
          >
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop"
              alt="Luxury gold jewelry craftsmanship"
              className="w-full h-full min-h-[260px] sm:min-h-[380px] md:min-h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent group-hover:from-black/85 transition-all" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-end justify-between">
              <div>
                <span className="text-amber-300 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest block">Master Artisans</span>
                <h3 className="text-white text-base sm:text-xl md:text-2xl font-serif font-bold mt-0.5 sm:mt-1">Crafted by Hand, Perfected by Time</h3>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 text-black flex items-center justify-center group-hover:bg-amber-400 transition-all shadow-md shrink-0">
                <ArrowRight size={14} className="sm:w-4 sm:h-4" />
              </div>
            </div>
          </Link>

          <Link
            to="/category/fashion"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer block opacity-100 visible"
          >
            <img
              src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop"
              alt="Luxury watch detail"
              className="w-full h-full min-h-[125px] sm:min-h-[180px] md:min-h-[240px] object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/85 transition-all" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between">
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">TIMEPIECES</span>
              <span className="text-amber-300 text-[10px] sm:text-[11px] font-semibold">View →</span>
            </div>
          </Link>

          <Link
            to="/category/cosmetics"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer block opacity-100 visible"
          >
            <img
              src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&auto=format&fit=crop"
              alt="Premium cosmetics collection"
              className="w-full h-full min-h-[125px] sm:min-h-[180px] md:min-h-[240px] object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/85 transition-all" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between">
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">BEAUTY</span>
              <span className="text-amber-300 text-[10px] sm:text-[11px] font-semibold">View →</span>
            </div>
          </Link>

          <Link
            to="/category/bags"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer block opacity-100 visible"
          >
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop"
              alt="Designer leather bag"
              className="w-full h-full min-h-[125px] sm:min-h-[180px] md:min-h-[240px] object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all" />
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-amber-400 text-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-md animate-pulse">
              SOON
            </div>
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">LEATHER</span>
            </div>
          </Link>

          <Link
            to="/category/cosmetics"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden group cursor-pointer block opacity-100 visible"
          >
            <img
              src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&auto=format&fit=crop"
              alt="Luxury fragrance bottles"
              className="w-full h-full min-h-[125px] sm:min-h-[180px] md:min-h-[240px] object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent group-hover:from-black/85 transition-all" />
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between">
              <span className="text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase">PARFUM</span>
              <span className="text-amber-300 text-[10px] sm:text-[11px] font-semibold">View →</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
