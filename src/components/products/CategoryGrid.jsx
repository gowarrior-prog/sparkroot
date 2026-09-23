import React from 'react';
import { ShoppingBag, Heart, Zap, Star } from 'lucide-react';

export default function CategoryGrid({ products, loading, likedProducts, onLike, onAddClick, onBuyNow, onNavigate }) {
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col bg-white border border-gray-200 p-4 rounded-2xl animate-pulse space-y-3">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
        <p className="text-base font-bold text-slate-700">No products available in this category right now.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => {
        const isLiked = !!likedProducts[product.id];
        return (
          <div
            key={product.id}
            onClick={() => onNavigate(`/product/${product.id}`)}
            className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
          >
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => onLike(e, product)}
                className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-gray-600 hover:text-red-500 hover:scale-110 transition cursor-pointer shadow-xs"
              >
                <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
              </button>
              <button
                type="button"
                onClick={(e) => onAddClick(e, product)}
                className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer shadow-xs"
              >
                <ShoppingBag size={14} />
              </button>
            </div>

            <div className="aspect-square rounded-xl bg-gray-50 overflow-hidden mb-3 p-2 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="text-[10px] text-gray-400 font-medium ml-1">(4.9)</span>
              </div>

              <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-black transition">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                  PKR {Number(product.price).toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-1">
              <button
                type="button"
                onClick={(e) => onBuyNow(e, product)}
                className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 text-[11px] sm:text-xs tracking-wider transition-all cursor-pointer"
              >
                <Zap size={13} className="text-amber-300" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
