'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from './lib/routerCompat';
import { useCart } from './CartContext';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import { products as fallbackProducts } from './dataproducts.js';

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  
  // Initialize with fallbackProducts immediately so products are 100% VISIBLE instantly!
  const [products, setProducts] = useState(() => fallbackProducts.slice(0, 12));

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!isMounted) return;
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            let display = data.filter(p => p.featured);
            if (display.length === 0) display = data.slice(0, 12);
            setProducts(display);
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch failed, displaying local products:', err);
      }
    };

    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  const handleAddClick = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert('Added to cart!');
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  const handleLike = (e, product) => {
    e.stopPropagation();
    toggleLike(product.id, product);
  };

  return (
    <section id="featured-products" className="py-12 sm:py-20 md:py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 sm:mb-12 md:mb-16">
          <div className="text-center md:text-left">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 block mb-1">Curated Selection</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight">
              Featured <span className="text-slate-400 font-light">Collection</span>
            </h2>
          </div>
          <p className="text-slate-500 mt-2 sm:mt-4 md:mt-0 max-w-sm text-center md:text-right font-normal text-xs sm:text-base leading-relaxed">
            Curated pieces from our latest arrivals, exclusively selected for you.
          </p>
        </div>

        {/* Products Grid — Always 100% visible, no hidden opacity classes! */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 gap-y-6 sm:gap-y-12">
          {products.map((product, idx) => (
            <div
              key={product.id || idx}
              className="group cursor-pointer flex flex-col bg-white border border-slate-200/80 p-2 sm:p-3.5 rounded-xl shadow-2xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 opacity-100 visible"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200/60 mb-2 sm:mb-3 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop';
                  }}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, product)}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 hover:bg-white hover:scale-110 active:scale-90 transition-all z-10 shadow-xs cursor-pointer"
                  title="Wishlist"
                >
                  <Heart size={14} className={likedProducts[product.id] ? 'fill-red-500 text-red-500 sm:w-4 sm:h-4' : 'text-slate-400 sm:w-4 sm:h-4'} />
                </button>

                {/* Out of Stock Overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-black text-white font-bold px-2.5 py-1 sm:px-4 sm:py-2 rounded uppercase tracking-wider text-[9px] sm:text-xs shadow-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-0.5 sm:mb-1">
                    {product.category || 'Luxury'}
                  </p>
                  <h3 className="text-xs sm:text-base font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-black transition">
                    {product.name}
                  </h3>
                  <p className="text-slate-900 font-bold text-xs sm:text-lg mb-2 sm:mb-3 tracking-tight">
                    PKR {Number(product.price).toLocaleString('en-PK')}
                  </p>
                </div>

                <div className="space-y-1.5 sm:space-y-2 mt-auto pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e, product)}
                    className="w-full bg-black text-white font-semibold py-2 sm:py-2.5 px-2 rounded-md flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[10px] sm:text-xs shadow-2xs cursor-pointer"
                  >
                    <Zap size={13} className="text-amber-300 sm:w-4 sm:h-4" /> Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleAddClick(e, product)}
                    className="w-full bg-slate-100 text-slate-900 border border-slate-300 font-semibold py-1.5 sm:py-2 px-2 rounded-md flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-slate-200 active:scale-95 transition-all uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[10px] sm:text-xs cursor-pointer"
                  >
                    <ShoppingCart size={13} className="sm:w-4 sm:h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}