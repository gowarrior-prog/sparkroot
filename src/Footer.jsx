'use client';

import React from 'react';
import { Link } from './lib/routerCompat';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Mail, Phone, ShieldCheck, Truck, RefreshCw, Sparkles, Lock, ArrowUpRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const pathname = usePathname();
  
  // Hide store Footer completely on Admin pages!
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-slate-100 relative overflow-hidden border-t border-slate-900">
      
      {/* Soft Ambient Background Lighting (Adjusted for Dark Mode) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-3xl" />
      </div>

      {/* ── Top Guarantee & Trust Highlights Bar ── */}
      <div className="border-b border-slate-800/80 bg-black py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">100% Genuine Gold</h4>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Certified Authentic Quality</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Express Delivery</h4>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">2-4 Days Across Pakistan</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
                <RefreshCw size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">7-Day Easy Returns</h4>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Hassle-Free Guarantee</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-amber-500 flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">VIP Support</h4>
                <p className="text-[11px] text-slate-400 font-light mt-0.5">Personal Concierge Service</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Main Footer Links Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Column 1: Brand & Story (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              {/* Ensure your Logo component handles dark mode or pass a color prop if needed */}
              <Logo className="h-16 sm:h-20" />
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
              Discover fine jewelry, precision timepieces, artisanal fragrances, and Italian leather accessories curated for enduring elegance and modern lifestyle.
            </p>

            {/* Social Media Links */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 block">CONNECT WITH US</span>
              <div className="flex items-center space-x-3">
                <a
                  href="http://www.facebook.com/share/1D1qD86Pha/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="http://www.instagram.com/sparkroot00?igsh=MWx1bHBxaHd6eWtycA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-xs"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Signature Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.25em] pb-1 border-b border-slate-800 inline-block">
              Curated Collections
            </h3>
            <ul className="space-y-3 text-xs font-semibold tracking-wider uppercase text-slate-400">
              <li>
                <Link href="/category/jewelry" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                  <span>Fine Jewelry</span>
                </Link>
              </li>
              <li>
                <Link href="/category/fashion" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:scale-125 transition-transform" />
                  <span>Luxury Watches</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cosmetics" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                  <span>Cosmetics & Beauty</span>
                </Link>
              </li>
              <li>
                <Link href="/category/bags" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:scale-125 transition-transform" />
                  <span>Bags & Accessories</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.25em] pb-1 border-b border-slate-800 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-3 text-xs font-semibold tracking-wider uppercase text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-white transition-colors">My Orders</Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">Shopping Bag</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-xs uppercase tracking-[0.25em] pb-1 border-b border-slate-800 inline-block">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0 shadow-xs">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Helpline</span>
                  <a href="tel:+923467291114" className="text-white hover:text-amber-500 transition font-bold">+92 346 7291114</a>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 shrink-0 shadow-xs">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Email</span>
                  <a href="mailto:sparkrootofficial@gmail.com" className="text-slate-300 hover:text-white transition text-[11px] truncate block font-medium">sparkrootofficial@gmail.com</a>
                </div>
              </li>
            </ul>

            {/* Payment Method Badges */}
            <div className="pt-2 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Payment Options</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-wider shadow-2xs">
                  Cash On Delivery
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-wider shadow-2xs">
                  Bank Transfer
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Legal Bar ── */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-emerald-500" />
            <p>&copy; {new Date().getFullYear()} SPARKROOT. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] hover:text-white transition cursor-pointer">100% Secure Checkout</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition flex items-center gap-1 font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}