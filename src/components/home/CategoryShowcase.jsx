'use client';

import { Link } from '../../lib/routerCompat';
import { ArrowRight, Gem, Watch, ShoppingBag, Sparkle, Sparkles } from 'lucide-react';

export default function CategoryShowcase() {
  const categories = [
    {
      name: 'Fine Jewelry',
      slug: 'jewelry',
      tagline: '18K Solid Gold & Precious Stones',
      itemCount: '18 Pieces',
      isComingSoon: false,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop',
      colSpan: 'md:col-span-8',
      icon: Gem
    },
    {
      name: 'Luxury Watches',
      slug: 'fashion',
      tagline: 'Precision Mechanical Horology',
      itemCount: '12 Pieces',
      isComingSoon: false,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop',
      colSpan: 'md:col-span-4',
      icon: Watch
    },
    {
      name: 'Cosmetics & Beauty',
      slug: 'cosmetics',
      tagline: 'Artisanal Elixirs & Fragrances',
      itemCount: '8 Collections',
      isComingSoon: false,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop',
      colSpan: 'md:col-span-4',
      icon: Sparkles
    },
    {
      name: 'Accessories & Bags',
      slug: 'bags',
      tagline: 'Italian Leather & Accessories',
      itemCount: 'COMING SOON',
      isComingSoon: true,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop',
      colSpan: 'md:col-span-8',
      icon: ShoppingBag
    }
  ];

  return (
    <section className="py-14 sm:py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-900 to-slate-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-2 sm:mb-3">
              <Sparkle size={13} className="animate-spin" style={{ animationDuration: '8s' }} />
              <span>Curated Collections</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight uppercase">
              Explore Our <span className="italic font-normal text-slate-400">Ateliers</span>
            </h2>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm max-w-md font-light">
            Discover exquisite craftsmanship across our signature luxury categories, designed for discerning taste.
          </p>
        </div>

        {/* Category Banners Grid — Always 100% visible */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/category/${cat.slug}`}
                className={`${cat.colSpan} group relative h-[250px] sm:h-[340px] md:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-xl block opacity-100 visible`}
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-300" />

                {/* Shimmer Border on Hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/40 rounded-2xl sm:rounded-3xl transition-colors duration-500 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-10">
                  <span className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full backdrop-blur-md border text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    cat.isComingSoon 
                      ? 'bg-amber-400 text-black border-amber-300 animate-pulse'
                      : 'bg-black/60 border-white/15 text-amber-300'
                  }`}>
                    <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                    {cat.itemCount}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-end justify-between">
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-slate-300 text-[10px] sm:text-xs font-medium tracking-widest uppercase">{cat.tagline}</p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-wide group-hover:text-amber-200 transition-colors">
                      {cat.name}
                    </h3>
                  </div>

                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-amber-400 transition-all duration-300 shadow-lg group-hover:scale-110 shrink-0">
                    <ArrowRight size={16} className="sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
