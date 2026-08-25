import { Heart } from 'lucide-react';

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
  return (
    <div className="flex flex-row gap-3 sm:gap-4 sticky top-28">
      {/* Left-Side Vertical Thumbnail Column (Always Visible on Left for Mobile & Desktop) */}
      {allImages.length > 0 && (
        <div className="flex flex-col gap-2 sm:gap-2.5 w-14 sm:w-16 md:w-20 overflow-y-auto max-h-[480px] sm:max-h-[550px] pr-1 scrollbar-thin flex-shrink-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              onMouseEnter={() => setSelectedImage(img)}
              onTouchStart={() => setSelectedImage(img)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg border-2 overflow-hidden transition-all duration-200 flex-shrink-0 cursor-pointer bg-white ${
                displayImage === img
                  ? 'border-black ring-2 ring-black/20 shadow-sm opacity-100'
                  : 'border-slate-200 hover:border-slate-400 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full bg-white rounded-xl border border-slate-200 relative shadow-sm min-h-[300px] sm:min-h-[420px] max-h-[550px] flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            className="max-h-[450px] sm:max-h-[500px] w-auto max-w-full object-contain transition-opacity duration-200"
            key={displayImage}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />

          {/* Wishlist Button on Image */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(product.id, product);
            }}
            className="absolute top-3 right-3 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200 hover:bg-white transition-all shadow-xs hover:scale-105 active:scale-95 z-10 cursor-pointer"
            title="Wishlist"
          >
            <Heart size={18} className={isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
          </button>

          {/* Out of Stock Overlay */}
          {!isStockAvailable && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-black text-white font-black px-5 py-2.5 rounded uppercase tracking-wider shadow-lg text-xs">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Photos Counter */}
        {allImages.length > 1 && (
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-2">
            Photo {currentImageIdx + 1} of {allImages.length}
          </p>
        )}
      </div>
    </div>
  );
}
