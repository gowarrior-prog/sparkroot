'use client';

import { useState, useEffect } from 'react';
import { useNavigate, Link } from './lib/routerCompat';
import { useCart } from './CartContext';
import { Heart, ShoppingBag, Zap, Star, ArrowRight } from 'lucide-react';
import { getInitialProducts, getCachedProducts } from './productStore';

function ProductCard({ product, onBuyNow, onAddToCart, onLike, isLiked }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-[#eaeaea] border border-gray-300/70 rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
    >
      {/* Top right wishlist & cart action icons */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => onLike(e, product)}
          className="p-1.5 bg-white/90 backdrop-blur-md rounded-full text-gray-600 hover:text-red-500 hover:scale-110 transition cursor-pointer shadow-2xs"
          title="Wishlist"
        >
          <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
        </button>
        <button
          type="button"
          onClick={(e) => onAddToCart(e, product)}
          className="p-1.5 bg-white/90 backdrop-blur-md rounded-full text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer shadow-2xs"
          title="Add to Cart"
        >
          <ShoppingBag size={14} />
        </button>
      </div>

      {/* Product Image Area */}
      <div className="aspect-square rounded-lg bg-transparent overflow-hidden mb-2.5 flex items-center justify-center p-1">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 mix-blend-multiply"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Product Content */}
      <div className="space-y-1">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[10px] text-gray-500 font-medium">(124)</span>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-black transition">
          {product.name}
        </h3>

        {/* Price in PKR */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-900">PKR {Number(product.price).toLocaleString('en-PK')}</span>
        </div>
      </div>

      {/* Full width Buy Now pill button */}
      <div className="mt-3 pt-1">
        <button
          type="button"
          onClick={(e) => onBuyNow(e, product)}
          className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-full flex items-center justify-center gap-1.5 text-[11px] sm:text-xs tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
        >
          <Zap size={13} className="text-amber-300" />
          <span>Buy Now</span>
        </button>
      </div>

    </div>
  );
}

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const initial = getInitialProducts();
    if (initial.length > 0) {
      setProducts(initial);
      setLoading(false);
    }
    getCachedProducts().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleAddClick = (e, product) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e, product) => {
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('buyNowItem', JSON.stringify({
        ...product,
        quantity: 1,
        cartKey: `buynow_${product.id}`
      }));
    }
    navigate('/checkout');
  };

  const handleLike = (e, product) => {
    e.stopPropagation();
    toggleLike(product.id, product);
  };

  return (
    <section id="best-sellers" className="py-8 sm:py-10 bg-[#f2f2f4] border-b border-gray-200 font-sans pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Best Sellers</h2>
          <Link
            to="/category/all"
            className="text-xs font-semibold text-slate-600 hover:text-black flex items-center gap-1 transition group"
          >
            <span>View All</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-[#eaeaea] border border-gray-200 rounded-xl p-4 h-64 animate-pulse" />
            ))}
          </div>
        )}

        {/* Product Grid / Empty State */}
        {!loading && (
          products.length === 0 ? (
            <div className="text-center py-12 bg-white/50 rounded-2xl border border-gray-200">
              <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">No Products Available</p>
              <p className="text-xs text-gray-400 mt-1">Database is currently empty. Add products from the Admin Panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id || idx}
                  product={product}
                  onBuyNow={handleBuyNow}
                  onAddToCart={handleAddClick}
                  onLike={handleLike}
                  isLiked={Boolean(likedProducts[product.id])}
                />
              ))}
            </div>
          )
        )}

      </div>
    </section>
  );
}