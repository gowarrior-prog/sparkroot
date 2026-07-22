// src/Hero.jsx
import Logo from './Logo';

export default function Hero() {
  const handleScrollToProducts = (e) => {
    e.preventDefault();
    const elem = document.getElementById('featured-products');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white py-16 md:py-24">
      {/* Background Subtle Gradient/Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-white opacity-80"></div>
      
      {/* Large watermark background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 select-none pointer-events-none w-full max-w-4xl flex justify-center">
        <Logo showText={false} className="h-96 w-96 text-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Main Logo Branding */}
          <div className="mb-6 flex justify-center">
            <Logo className="h-16 sm:h-20 md:h-28" textClass="text-4xl sm:text-6xl md:text-7xl" />
          </div>

          <p className="text-xl md:text-3xl text-slate-600 font-medium mb-10 md:mb-12 leading-relaxed tracking-tight">
            Curated Luxury Fashion • Minimalist Aesthetics
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8 w-full max-w-lg">
            <button
              onClick={handleScrollToProducts}
              className="
                flex-1 inline-flex items-center justify-center 
                px-10 py-5 text-sm font-bold tracking-widest uppercase
                text-white bg-black hover:bg-slate-800
                transition-all duration-300 shadow-md cursor-pointer
              "
            >
              Shop Now
            </button>

            <button
              onClick={handleScrollToProducts}
              className="
                flex-1 inline-flex items-center justify-center 
                px-10 py-5 text-sm font-bold tracking-widest uppercase
                text-black border-2 border-black
                hover:bg-black hover:text-white
                transition-all duration-300 cursor-pointer
              "
            >
              New Arrivals
            </button>
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
      <div 
        onClick={handleScrollToProducts} 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
      >
        <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}