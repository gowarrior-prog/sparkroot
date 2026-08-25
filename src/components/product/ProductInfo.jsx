import { ShoppingCart, Star, Zap, Truck, RotateCcw, Shield } from 'lucide-react';

export default function ProductInfo({
  product,
  isStockAvailable,
  handleBuyNow,
  handleAddToCart
}) {
  return (
    <div className="flex flex-col justify-center space-y-6">
      <div>
        <p className="text-slate-400 font-bold tracking-widest uppercase mb-1.5 text-xs">
          {product.category || 'Luxury'}
        </p>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-black leading-tight">
          {product.name}
        </h1>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200 pb-5">
        <span className="text-2xl sm:text-3xl font-black text-black">
          PKR {Number(product.price).toLocaleString('en-PK')}
        </span>
        {product.originalPrice && (
          <span className="text-lg sm:text-xl text-slate-400 line-through font-bold">
            PKR {Number(product.originalPrice).toLocaleString('en-PK')}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-black font-black text-xs">4.9</span>
        <span className="text-slate-500 font-medium text-xs">(48 Verified Reviews)</span>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Description</h3>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
          {product.description ||
            'Premium quality product crafted with exceptional attention to detail. Perfect for personal styling or luxury gifting.'}
        </p>
      </div>

      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-md flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
          ⚠️ Limited Stock: Only {product.stock} items left in inventory!
        </p>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleBuyNow}
          disabled={!isStockAvailable}
          className={`w-full py-3.5 sm:py-4 px-8 rounded-lg font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition text-xs sm:text-sm shadow-xs cursor-pointer hover:bg-slate-800 active:scale-98 ${
            isStockAvailable ? 'bg-black text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Zap size={18} className="text-amber-300" />
          {isStockAvailable ? 'Buy Now' : 'Out of Stock'}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={!isStockAvailable}
          className={`w-full py-3.5 sm:py-4 px-8 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 transition text-xs sm:text-sm border-2 border-black cursor-pointer hover:bg-slate-100 active:scale-98 ${
            isStockAvailable ? 'bg-white text-black' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 text-xs font-bold uppercase tracking-widest">
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-xs">
          <Truck size={18} className="mx-auto mb-1 text-black" />
          <p className="text-slate-400 text-[9px] mb-0.5">Fast Delivery</p>
          <p className="text-black text-xs font-black">2-4 Days</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-xs">
          <RotateCcw size={18} className="mx-auto mb-1 text-black" />
          <p className="text-slate-400 text-[9px] mb-0.5">Easy Returns</p>
          <p className="text-black text-xs font-black">7 Days</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 text-center shadow-xs">
          <Shield size={18} className="mx-auto mb-1 text-black" />
          <p className="text-slate-400 text-[9px] mb-0.5">Warranty</p>
          <p className="text-black text-xs font-black">100% Genuine</p>
        </div>
      </div>
    </div>
  );
}
