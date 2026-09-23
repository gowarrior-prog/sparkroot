'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function PromoBanners() {
  return (
    <section className="py-10 bg-[#f2f2f4] border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Promo Banner (Clean Image with crisp Overlay Text) */}
          <div className="relative rounded-2xl overflow-hidden bg-black text-white min-h-[240px] sm:min-h-[260px] flex items-center shadow-md group">
            <img
              src="/images/promo1_clean.jpg"
              alt="Your Style Our Priority"
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            
            <div className="relative z-10 p-6 sm:p-8 space-y-2.5 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
                SPARKROOT ATELIER
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase leading-tight">
                Your Style, Our Priority <br />
                <span className="text-amber-200">SHOP THE BEST</span>
              </h3>
              <p className="text-[11px] text-gray-300 tracking-wide font-light">
                FASHION | JEWELLERY | COSMETICS | BAGS | GADGETS
              </p>
              <div className="pt-2">
                <Link
                  to="/category/fashion"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-xs uppercase rounded-md hover:bg-gray-100 transition shadow-xs group/btn"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Promo Banner (Clean Image with crisp Overlay Text) */}
          <div className="relative rounded-2xl overflow-hidden bg-black text-white min-h-[240px] sm:min-h-[260px] flex items-center shadow-md group">
            <img
              src="/images/promo2_clean.jpg"
              alt="Style Meets Everything"
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            
            <div className="relative z-10 p-6 sm:p-8 space-y-2.5 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
                YOUR ONE STOP ONLINE STORE
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                <span className="font-serif italic text-amber-200 block">Style Meets</span>
                <span className="uppercase tracking-wide">EVERYTHING</span>
              </h3>
              <p className="text-[11px] text-gray-300 tracking-wide font-light">
                Premium Luxury Accessories & Collections
              </p>
              <div className="pt-2">
                <Link
                  to="/category/jewelry"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase rounded-md hover:bg-amber-300 transition shadow-xs group/btn"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
