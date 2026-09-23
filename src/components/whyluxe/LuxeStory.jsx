import React from 'react';
import { Crown, Diamond, Star, ArrowRight } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function LuxeStory() {
  return (
    <div className="py-14 sm:py-20 md:py-28 relative border-t border-slate-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-amber-50/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <Crown size={24} className="text-amber-500/70 mx-auto mb-4 sm:mb-6 sm:w-7 sm:h-7" />
          <blockquote className="text-xl sm:text-4xl lg:text-5xl font-serif text-slate-900 leading-snug tracking-tight px-2 sm:px-0">
            &ldquo;Luxury is not about price. It&rsquo;s about the <span className="italic text-amber-700">feeling</span> of owning something truly extraordinary.&rdquo;
          </blockquote>
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3">
            <div className="h-px w-8 sm:w-12 bg-amber-400" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-400">SPARKROOT PHILOSOPHY</span>
            <div className="h-px w-8 sm:w-12 bg-amber-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="text-center space-y-3 sm:space-y-4 group p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-100/70 hover:bg-amber-50/80 transition-all">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-center">
              <Diamond size={20} className="text-amber-600 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">Ethically Sourced</h4>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Every gemstone and precious metal is responsibly sourced with full traceability from mine to masterpiece.
            </p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4 group p-5 sm:p-6 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:bg-slate-50 transition-all">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center">
              <Star size={20} className="text-slate-700 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">Lifetime Guarantee</h4>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Our lifetime craftsmanship warranty ensures your piece remains as extraordinary as the day it was created.
            </p>
          </div>

          <div className="text-center space-y-3 sm:space-y-4 group p-5 sm:p-6 rounded-2xl bg-amber-50/40 border border-amber-100/70 hover:bg-amber-50/80 transition-all">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-white border border-amber-200/80 shadow-xs flex items-center justify-center">
              <Crown size={20} className="text-amber-600 sm:w-6 sm:h-6" />
            </div>
            <h4 className="font-serif text-base sm:text-lg font-bold text-slate-900">Bespoke Service</h4>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
              Personal styling consultations and custom designs tailored to your unique vision and occasion.
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mt-16 text-center">
          <Link
            to="/category/jewelry"
            className="inline-flex items-center gap-2.5 sm:gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-black text-white rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] hover:bg-slate-800 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          >
            <span>Explore All Collections</span>
            <ArrowRight size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
