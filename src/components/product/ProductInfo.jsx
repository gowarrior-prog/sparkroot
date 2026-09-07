'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Zap, Plus, Minus, Check, Ruler, X, Info } from 'lucide-react';

// Helper to determine realistic luxury swatch colors based on color name
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

export default function ProductInfo({
  product,
  reviews = [],
  isStockAvailable,
  handleBuyNow,
  handleAddToCart
}) {
  const sizesList = Array.isArray(product.sizesList) && product.sizesList.length > 0
    ? product.sizesList
    : (typeof product.sizes === 'string' && product.sizes.trim()
        ? product.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : []);

  const colorsList = Array.isArray(product.colorsList) && product.colorsList.length > 0
    ? product.colorsList
    : (typeof product.colors === 'string' && product.colors.trim()
        ? product.colors.split(',').map(c => c.trim()).filter(Boolean)
        : []);

  const [selectedSize, setSelectedSize] = useState(sizesList[0] || null);
  const [selectedColor, setSelectedColor] = useState(colorsList[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    if (sizesList.length > 0 && !sizesList.includes(selectedSize)) {
      setSelectedSize(sizesList[0]);
    }
  }, [product.sizes, product.sizesList]);

  useEffect(() => {
    if (colorsList.length > 0 && !colorsList.includes(selectedColor)) {
      setSelectedColor(colorsList[0]);
    }
  }, [product.colors, product.colorsList]);

  const allReviews = reviews.length > 0 ? reviews : (product.reviews || []);
  const reviewCount = allReviews.length;
  const avgRating = reviewCount > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : '5.0';

  const scrollToReviews = (e) => {
    e.preventDefault();
    const elem = document.getElementById('customer-reviews');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onBuyNowClick = () => {
    handleBuyNow({
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  const onAddToCartClick = () => {
    handleAddToCart({
      size: selectedSize,
      color: selectedColor,
      quantity
    });
  };

  return (
    <div className="flex flex-col space-y-7 pt-2 md:pt-0 max-w-xl">
      {/* 1. BREADCRUMB EYEBROW */}
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
        <span>SPARKROOT</span>
        <span>/</span>
        <span className="text-slate-600 font-bold">{product.category || 'COLLECTION'}</span>
      </div>

      {/* 2. PRODUCT TITLE */}
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-[1.15]">
          {product.name}
        </h1>
      </div>

      {/* 3. PRICE */}
      <div className="space-y-1.5 pb-2">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            PKR {Number(product.price).toLocaleString('en-PK')}
          </span>
        </div>

        {/* Rating stars link */}
        <div className="pt-2 flex items-center gap-2">
          <a
            href="#customer-reviews"
            onClick={scrollToReviews}
            className="inline-flex items-center gap-1.5 group cursor-pointer"
          >
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-black ml-1">{avgRating}</span>
            <span className="text-xs text-slate-400 font-medium group-hover:text-black transition">
              ({reviewCount} verified {reviewCount === 1 ? 'review' : 'reviews'})
            </span>
          </a>
        </div>
      </div>

      {/* 4. COLOR / METAL FINISH (Circular Swatches with Checkmark) */}
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

      {/* 5. SIZE (US STANDARD) / SIZES ROW WITH SIZE GUIDE MODAL */}
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

          {/* Segmented Box Buttons Row */}
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

      {/* 6. QUANTITY PICKER & ACTION BUTTONS */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !isStockAvailable}
                className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-bold text-sm text-black">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!isStockAvailable}
                className="w-8 h-8 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {isStockAvailable ? (
            <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Available for immediate dispatch
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Currently Unavailable
            </span>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onBuyNowClick}
            disabled={!isStockAvailable}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 transition text-xs shadow-xs hover:shadow-md active:scale-98 cursor-pointer ${
              isStockAvailable
                ? 'bg-black text-white hover:bg-slate-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Zap size={16} className="text-amber-300" />
            {isStockAvailable ? 'Buy Now' : 'Out of Stock'}
          </button>

          <button
            type="button"
            onClick={onAddToCartClick}
            disabled={!isStockAvailable}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 transition text-xs border-2 cursor-pointer active:scale-98 ${
              isStockAvailable
                ? 'bg-white text-black border-black hover:bg-slate-50'
                : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            Add to Bag
          </button>
        </div>
      </div>

      {/* 7. ATELIER DETAILS */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Description & Specifications
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {product.description ||
              'Exclusively crafted studio piece. Features hand-finished detailing and quality composition.'}
          </p>
        </div>
      </div>

      {/* SIZE GUIDE MODAL */}
      {showSizeGuide && (
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
      )}
    </div>
  );
}
