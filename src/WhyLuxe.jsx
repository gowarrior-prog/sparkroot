// src/components/WhyLuxe.jsx
export default function WhyLuxe() {
  return (
    <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight uppercase">
            Crafted for <span className="text-slate-400">Timeless</span> Moments
          </h2>
          <p className="mt-6 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium tracking-tight">
            Where elegance meets exclusivity. Every piece tells a story of sophistication.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-500">
              <span className="text-3xl text-black">✦</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 uppercase tracking-widest text-lg">Curated Excellence</h3>
            <p className="text-slate-500 font-medium">
              Hand-selected from the world's finest artisans and emerging designers.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-500">
              <span className="text-3xl text-black">∞</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 uppercase tracking-widest text-lg">Sustainable Luxury</h3>
            <p className="text-slate-500 font-medium">
              Ethical materials, timeless designs built to last beyond seasons.
            </p>
          </div>

          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-slate-100 transition-colors duration-500">
              <span className="text-3xl text-black">🛡️</span>
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 uppercase tracking-widest text-lg">Effortless Experience</h3>
            <p className="text-slate-500 font-medium">
              Seamless shopping, free express shipping, and 24-hr easy cancellations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}