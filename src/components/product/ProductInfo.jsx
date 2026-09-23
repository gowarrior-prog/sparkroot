'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Zap, Plus, Minus } from 'lucide-react';
import ProductOptionSelectors from './ProductOptionSelectors';
import SizeGuideModal from './SizeGuideModal';

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
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const onBuyNowClick = () => {
    handleBuyNow({ size: selectedSize, color: selectedColor, quantity });
  };

  const onAddToCartClick = () => {
    handleAddToCart({ size: selectedSize, color: selectedColor, quantity });
  };

  return (
    <div className="flex flex-col space-y-7 pt-2 md:pt-0 max-w-xl">
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] text-slate-400 uppercase">
        <span>SPARKROOT</span>
        <span>/</span>
        <span className="text-slate-600 font-bold">{product.category || 'COLLECTION'}</span>
      </div>

      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-[1.15]">
          {product.name}
        </h1>
      </div>

      <div className="space-y-1.5 pb-2">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            PKR {Number(product.price).toLocaleString('en-PK')}
          </span>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <a href="#customer-reviews" onClick={scrollToReviews} className="inline-flex items-center gap-1.5 group cursor-pointer">
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

      <ProductOptionSelectors
        colorsList={colorsList}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        sizesList={sizesList}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        setShowSizeGuide={setShowSizeGuide}
      />

      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onBuyNowClick}
            disabled={!isStockAvailable}
            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-[0.16em] flex items-center justify-center gap-2.5 transition text-xs shadow-xs hover:shadow-md active:scale-98 cursor-pointer ${
              isStockAvailable ? 'bg-black text-white hover:bg-slate-800' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
              isStockAvailable ? 'bg-white text-black border-black hover:bg-slate-50' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
            Description & Specifications
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {product.description || 'Exclusively crafted studio piece. Features hand-finished detailing and quality composition.'}
          </p>
        </div>
      </div>

      <SizeGuideModal showSizeGuide={showSizeGuide} setShowSizeGuide={setShowSizeGuide} />
    </div>
  );
}
