'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Sparkle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Link } from './lib/routerCompat';

export default function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);

  const heroSlides = [
    {
      category: "FINE JEWELRY",
      title: "Handcrafted Gold & Diamond Rings",
      subtitle: "Solid 18K gold and carved obsidian luxury pieces designed for timeless elegance.",
      tag: "Jewelry Collection",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1000&auto=format&fit=crop",
      slug: "jewelry",
      badgeText: "18K Gold Atelier Ring"
    },
    {
      category: "LUXURY FASHION",
      title: "Precision Automatic Watches",
      subtitle: "Minimalist sapphire crystal timepieces crafted for the discerning modern lifestyle.",
      tag: "Horology • Watches",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop",
      slug: "fashion",
      badgeText: "Sapphire Chronograph"
    },
    {
      category: "COSMETICS & SCENTS",
      title: "Artisanal Fragrance & Beauty",
      subtitle: "Pure organic elixirs and luxury scents formulated for radiant sophistication.",
      tag: "Beauty Collection",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop",
      slug: "cosmetics",
      badgeText: "Parfum & Beauty Elixir"
    },
    {
      category: "LEATHER ACCESSORIES",
      title: "Italian Leather Handbags",
      subtitle: "Full-grain genuine Italian leather accessories crafted for enduring style and elegance.",
      tag: "Bags & Accessories",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop",
      slug: "bags",
      badgeText: "Italian Leather Tote"
    }
  ];

  // Auto-slide every 3 seconds (3000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleScrollToProducts = (e) => {
    e.preventDefault();
    const elem = document.getElementById('featured-products');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = heroSlides[activeIdx];

  return (
    <section className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-white text-slate-900 pt-20 sm:pt-28 pb-12 sm:pb-16 border-b border-slate-100">
      
      {/* Background Soft Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 sm:-top-40 sm:-left-40 w-72 sm:w-96 h-72 sm:h-96 bg-amber-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 sm:-bottom-40 sm:-right-40 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-slate-100/70 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Headings & Information */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left animate-fade-in">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-100 text-slate-800 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] border border-slate-200/80 shadow-xs">
              <Sparkles size={13} className="text-amber-600 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
              <span>SPARKROOT ATELIER • AUTUMN 2026</span>
            </div>

            {/* Main Title */}
            <div className="space-y-2 sm:space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-bold tracking-tight uppercase leading-[1.1] text-slate-950">
                {current.title.split(' ')[0]} <br className="hidden sm:block" />
                <span className="text-slate-500 italic font-normal ml-1 sm:ml-0">
                  {current.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-600 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed px-1 sm:px-0">
                {current.subtitle}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 pt-1 sm:pt-2 max-w-md mx-auto lg:mx-0">
              <button
                onClick={handleScrollToProducts}
                className="flex-1 sm:flex-none px-5 sm:px-9 py-3.5 sm:py-4 bg-black hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
              >
                <span>Shop Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to={`/category/${current.slug}`}
                className="flex-1 sm:flex-none px-4 sm:px-8 py-3.5 sm:py-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-semibold text-[11px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer text-center"
              >
                <span>{current.category}</span>
              </Link>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-4 sm:pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-2 sm:gap-4 text-center lg:text-left max-w-md lg:max-w-lg mx-auto lg:mx-0">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-slate-900 font-bold text-xs sm:text-base flex items-center justify-center lg:justify-start gap-1">
                  <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                  <span>100% Genuine</span>
                </div>
                <div className="text-slate-500 text-[10px] sm:text-xs">Certified Gold</div>
              </div>
              <div className="space-y-0.5 sm:space-y-1 border-x border-slate-200 px-1 sm:px-2">
                <div className="text-slate-900 font-bold text-xs sm:text-base">2-4 Days</div>
                <div className="text-slate-500 text-[10px] sm:text-xs">Express Shipping</div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <div className="text-slate-900 font-bold text-xs sm:text-base">7-Day Easy</div>
                <div className="text-slate-500 text-[10px] sm:text-xs">Free Returns</div>
              </div>
            </div>

          </div>

          {/* Right Side: Product Photo Card */}
          <div className="lg:col-span-5 relative flex justify-center mt-2 lg:mt-0">
            
            <div className="relative w-full max-w-xs sm:max-w-md bg-white border border-slate-200 p-2.5 sm:p-3.5 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden group">
              
              {/* Product Photo Container */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                
                {/* Image with smooth transition */}
                <img
                  key={current.image}
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out animate-fade-in"
                />

                {/* Top Category Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/85 backdrop-blur-md text-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-md">
                  <Sparkle size={12} className="text-amber-400" />
                  <span>{current.tag}</span>
                </div>

                {/* Bottom Overlay Info Banner */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/80 flex items-center justify-between text-slate-900 shadow-md">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm tracking-wide uppercase">{current.badgeText}</h4>
                    <p className="text-slate-500 text-[10px] sm:text-[11px] mt-0.5 tracking-wide">{current.tag}</p>
                  </div>
                  <Link
                    to={`/category/${current.slug}`}
                    className="p-2 sm:p-2.5 bg-black text-white rounded-full hover:bg-slate-800 transition cursor-pointer shrink-0"
                  >
                    <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </div>

              {/* Progress Indicator Bar */}
              <div className="mt-2 sm:mt-3 flex items-center justify-between px-2">
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Auto-slides every 3s</span>
                <div className="flex gap-1 sm:gap-1.5">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIdx(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                        activeIdx === idx ? 'w-5 sm:w-7 bg-black' : 'w-2 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}