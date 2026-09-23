import React from 'react';
import { X } from 'lucide-react';

export default function SizeGuideModal({ showSizeGuide, setShowSizeGuide }) {
  if (!showSizeGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 relative">
        <button
          onClick={() => setShowSizeGuide(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-black p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">
          Sizing Chart
        </span>
        <h3 className="text-xl font-extrabold text-black tracking-tight mb-4">
          Size & Measurement Guide
        </h3>

        <div className="space-y-4 text-xs">
          <p className="text-slate-600 font-normal">
            Use this reference table to find your ideal fit. All measurements correspond to circumference or diameter.
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2.5">Standard Size</th>
                  <th className="p-2.5">Diameter</th>
                  <th className="p-2.5">Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr><td className="p-2.5 font-bold text-black">US 5 / Small</td><td className="p-2.5">15.7 mm</td><td className="p-2.5">49.3 mm</td></tr>
                <tr><td className="p-2.5 font-bold text-black">US 6 / Medium</td><td className="p-2.5">16.5 mm</td><td className="p-2.5">51.9 mm</td></tr>
                <tr><td className="p-2.5 font-bold text-black">US 7 / Large</td><td className="p-2.5">17.3 mm</td><td className="p-2.5">54.4 mm</td></tr>
                <tr><td className="p-2.5 font-bold text-black">US 8 / XL</td><td className="p-2.5">18.1 mm</td><td className="p-2.5">57.0 mm</td></tr>
                <tr><td className="p-2.5 font-bold text-black">US 9 / XXL</td><td className="p-2.5">19.0 mm</td><td className="p-2.5">59.5 mm</td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <p className="font-semibold text-black mb-1">How to Measure at Home:</p>
            <p className="text-slate-500">
              Wrap a strip of paper around your finger or wrist, mark the overlap, and measure the distance in millimeters with a ruler.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSizeGuide(false)}
          className="mt-6 w-full py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
