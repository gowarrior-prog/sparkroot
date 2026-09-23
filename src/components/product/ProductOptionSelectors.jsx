import React from 'react';
import { Check, Ruler, Info } from 'lucide-react';

const getSwatchColor = (colorName) => {
  const name = String(colorName).toLowerCase();
  if (name.includes('champagne')) return '#E8CE9B';
  if (name.includes('rose gold') || name.includes('rose')) return '#ECC5B9';
  if (name.includes('gold') || name.includes('yellow')) return '#DFBA73';
  if (name.includes('silver') || name.includes('platinum') || name.includes('white gold')) return '#E2E8F0';
  if (name.includes('black') || name.includes('obsidian') || name.includes('onyx') || name.includes('gunmetal')) return '#18181B';
  if (name.includes('white') || name.includes('ivory')) return '#F8FAFC';
  if (name.includes('ruby') || name.includes('red') || name.includes('burgundy')) return '#991B1B';
  if (name.includes('sapphire') || name.includes('blue') || name.includes('navy')) return '#1E3A8A';
  if (name.includes('emerald') || name.includes('green')) return '#065F46';
  if (name.includes('brown') || name.includes('leather') || name.includes('tan')) return '#78350F';
  return '#CBD5E1';
};

export default function ProductOptionSelectors({
  colorsList,
  selectedColor,
  setSelectedColor,
  sizesList,
  selectedSize,
  setSelectedSize,
  setShowSizeGuide
}) {
  return (
    <>
      {colorsList.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-[0.18em] text-slate-400 text-[11px]">
              COLOR / FINISH
            </span>
            <span className="font-semibold text-slate-900 text-xs">
              {selectedColor}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {colorsList.map((col) => {
              const isSelected = selectedColor === col;
              const bg = getSwatchColor(col);
              const isLight = bg === '#F8FAFC' || bg === '#E2E8F0';
              return (
                <button
                  type="button"
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`relative w-9 h-9 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer shadow-xs ${
                    isSelected
                      ? 'ring-2 ring-black ring-offset-2 scale-105'
                      : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: bg }}
                  title={col}
                >
                  {isSelected && (
                    <Check
                      size={14}
                      className={isLight ? 'text-black stroke-[3]' : 'text-white stroke-[3]'}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {sizesList.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-[0.18em] text-slate-400 text-[11px]">
                SIZE
              </span>
              <span className="font-bold text-black text-xs">
                {selectedSize}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="inline-flex items-center gap-1 font-bold uppercase tracking-wider text-[11px] text-slate-500 hover:text-black transition cursor-pointer"
            >
              <Ruler size={13} />
              <span>SIZE GUIDE</span>
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
            {sizesList.map((sz) => {
              const isSelected = selectedSize === sz;
              return (
                <button
                  type="button"
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 px-3 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-slate-500 font-normal pt-1">
            <Info size={13} className="text-slate-400 flex-shrink-0" />
            <span>Select your standard size for comfortable fit.</span>
          </p>
        </div>
      )}
    </>
  );
}
