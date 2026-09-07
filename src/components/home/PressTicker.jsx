'use client';

export default function PressTicker() {
  const pressLogos = [
    { name: 'VOGUE', quote: '"Sparkroot is redefining minimalist luxury."' },
    { name: 'ELLE', quote: '"Impeccable craftsmanship and timeless aesthetics."' },
    { name: 'GQ', quote: '"The ultimate destination for modern horology."' },
    { name: "HARPER'S BAZAAR", quote: '"Artisanal precision in every handcrafted jewel."' },
    { name: 'VANITY FAIR', quote: '"Luxury curated to perfection."' }
  ];

  return (
    <section className="bg-black text-white py-10 sm:py-12 border-y border-white/10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6 text-center">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-amber-400/80 inline-block">
          AS FEATURED IN
        </span>
      </div>

      <div className="flex overflow-hidden space-x-8 sm:space-x-12 select-none">
        <div className="flex space-x-8 sm:space-x-12 items-center justify-around w-full max-w-7xl mx-auto px-4 flex-wrap gap-y-4 sm:gap-y-6">
          {pressLogos.map((item, idx) => (
            <div key={idx} className="text-center group cursor-default">
              <h3 className="text-lg sm:text-2xl font-serif tracking-[0.2em] font-black text-slate-300 group-hover:text-white transition-colors">
                {item.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 font-light italic mt-0.5 sm:mt-1">{item.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
