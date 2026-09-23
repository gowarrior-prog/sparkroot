'use client';

import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const handleScrollToProducts = (e) => {
    e.preventDefault();
    const elem = document.getElementById('best-sellers');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-28 sm:pt-36 pb-6 bg-[#f8f8fa] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full width Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-black text-white min-h-[380px] sm:min-h-[440px] flex items-center group">
          
          {/* Background Clean Image (NO baked text in photo) */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero_clean.jpg"
              alt="Upgrade Your Style Today"
              className="w-full h-full object-cover opacity-90 scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          </div>

          {/* Clean HTML Text Overlay */}
          <div className="relative z-10 max-w-xl p-8 sm:p-12 lg:p-16 space-y-4 animate-in fade-in slide-in-from-left duration-700">
            
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-gray-300 block">
              NEW ARRIVALS
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Upgrade Your <br />
              Style Today
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-light max-w-md leading-relaxed">
              Discover the latest trends in fashion, electronics, beauty and more
            </p>

            <div className="pt-4">
              <button
                onClick={handleScrollToProducts}
                className="inline-flex items-center gap-3 px-8 py-3.5 bg-white text-slate-900 font-semibold text-sm rounded-none hover:bg-gray-100 active:scale-95 transition-all shadow-md cursor-pointer group/btn"
              >
                <span>Shop Now</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}