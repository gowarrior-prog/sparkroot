// src/components/Hero.jsx
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Subtle Gradient/Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-white opacity-80"></div>
      
      {/* Large watermark 'S' */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40rem] font-black text-slate-50 opacity-50 select-none pointer-events-none tracking-tighter">
        S
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-black text-white px-3 py-1 text-2xl font-black rounded-sm">S</span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-widest text-black leading-none uppercase">
              SPARKROOT
            </h1>
          </div>

          <p className="text-xl md:text-3xl text-slate-600 font-medium mb-10 md:mb-12 leading-relaxed tracking-tight">
            Curated Luxury Fashion • Minimalist Aesthetics
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8 w-full max-w-lg">
            <Link
              to="/featured"
              className="
                flex-1 inline-flex items-center justify-center 
                px-10 py-5 text-sm font-bold tracking-widest uppercase
                text-white bg-black hover:bg-slate-800
                transition-all duration-300 
              "
            >
              Shop Now
            </Link>

            <Link
              to="/featured"
              className="
                flex-1 inline-flex items-center justify-center 
                px-10 py-5 text-sm font-bold tracking-widest uppercase
                text-black border-2 border-black
                hover:bg-black hover:text-white
                transition-all duration-300 
              "
            >
              New Arrivals
            </Link>
          </div>

          {/* Trust signals */}
          <div className="mt-16 text-slate-500 font-semibold text-sm md:text-base flex flex-wrap justify-center gap-x-8 gap-y-3 uppercase tracking-wider">
            <span>✓ Free Shipping Over PKR 10,000</span>
            <span>✓ 24hr Easy Cancellation</span>
            <span>✓ Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}