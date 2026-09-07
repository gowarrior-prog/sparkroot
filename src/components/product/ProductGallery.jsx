'use client';

import { useState } from 'react';
import { Heart, ZoomIn } from 'lucide-react';

export default function ProductGallery({
  allImages,
  displayImage,
  setSelectedImage,
  product,
  isLiked,
  toggleLike,
  isStockAvailable,
  currentImageIdx
}) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 md:sticky md:top-24 w-full">
      {/* Thumbnails strip */}
      {allImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[520px] pb-2 sm:pb-0 scrollbar-thin flex-shrink-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              onMouseEnter={() => setSelectedImage(img)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 flex-shrink-0 cursor-pointer bg-white ${
                displayImage === img
                  ? 'border-black ring-2 ring-black/10 shadow-sm opacity-100 scale-102'
                  : 'border-slate-200/80 hover:border-slate-400 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="flex-1 flex flex-col items-center min-w-0">
        <div
          className="w-full aspect-square bg-white rounded-2xl border border-slate-200/90 relative shadow-xs flex items-center justify-center p-4 sm:p-8 overflow-hidden group"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={displayImage}
            alt={product.name}
            className={`max-h-full w-auto max-w-full object-contain transition-transform duration-500 ease-out ${
              isZoomed ? 'scale-110 cursor-zoom-in' : 'scale-100'
            }`}
            key={displayImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(product.id, product);
            }}
            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full border border-slate-200/80 hover:bg-white transition-all shadow-xs hover:scale-110 active:scale-95 z-10 cursor-pointer"
            title="Wishlist"
          >
            <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>

          {/* Out of Stock Overlay */}
          {!isStockAvailable && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-black text-white font-bold px-6 py-3 rounded-xl uppercase tracking-widest shadow-xl text-xs">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Photos Counter & Zoom Hint */}
        <div className="w-full flex justify-between items-center text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-2.5 px-1">
          <span>
            {allImages.length > 1 ? `Photo ${currentImageIdx + 1} of ${allImages.length}` : 'High Resolution'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <ZoomIn size={13} /> Hover to zoom
          </span>
        </div>
      </div>
    </div>
  );
}
