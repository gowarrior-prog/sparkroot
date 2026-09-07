'use client';

import { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Lock, ArrowRight, Diamond, Crown, Star } from 'lucide-react';
import { Link } from './lib/routerCompat';

export default function WhyLuxe() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section className="bg-white text-slate-900 relative overflow-hidden border-t border-slate-100">
      
      {/* ── Part 1: Luxury Lifestyle Image Mosaic ── */}
      <div className="pt-14 sm:pt-24 pb-12 sm:pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
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

          {/* Mosaic Grid — Always 100% visible */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
            
            {/* Large featured image: Fine Jewelry */}
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

            {/* Top right small: Timepieces */}
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

            {/* Top right - second: Beauty */}
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

            {/* Bottom right small: Leather Accessories (Coming Soon) */}
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

            {/* Bottom right - last: Fragrance */}
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

      {/* ── Part 2: Luxury Quote & Brand Story ── */}
      <div className="py-14 sm:py-20 md:py-28 relative border-t border-slate-100">
        {/* Soft gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-amber-50/60 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Inspirational Quote */}
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

          {/* Brand Story Cards */}
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

          {/* CTA Banner */}
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

      {/* ── Part 3: VIP Newsletter Banner ── */}
      <div className="pb-16 sm:pb-20 pt-2 sm:pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-50/90 via-white to-amber-100/80 p-6 sm:p-14 border border-amber-200/80 text-slate-900 overflow-hidden shadow-xl">
            
            {/* Background luxury ambient glow */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 p-8 text-amber-900/5 pointer-events-none hidden sm:block">
              <Sparkles size={180} />
            </div>

            <div className="relative z-10 max-w-2xl space-y-4 sm:space-y-6">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white text-amber-800 border border-amber-300/80 text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
                <Sparkles size={12} className="text-amber-600" />
                VIP ATELIER ACCESS
              </span>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-950 tracking-tight">
                Join The Sparkroot Privé Club
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                Subscribe to receive private invitations to unreleased jewelry drops, bespoke styling offers, and an instant 10% privilege discount on your first atelier purchase.
              </p>

              {subscribed ? (
                <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 animate-fade-in shadow-xs">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>Welcome to Sparkroot Privé! Check your inbox for your 10% privilege code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your VIP email address..."
                    required
                    className="flex-1 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-7 py-3 sm:py-3.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest transition shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Subscribe</span>
                    <Send size={13} />
                  </button>
                </form>
              )}

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-500 text-[10px] sm:text-[11px] font-medium pt-1">
                <span className="flex items-center gap-1"><Lock size={12} className="text-amber-700" /> 100% Secure & Private</span>
                <span>• No Spam</span>
                <span>• Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}