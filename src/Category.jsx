'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from './lib/routerCompat';
import { useCart } from './CartContext';
import { ShoppingBag, Heart, Zap, Star } from 'lucide-react';
import SEO from './SEO';
import { API } from './api';
import { getInitialProducts, getCachedProducts } from './productStore';

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();

  const filterCategory = (allProds, catSlug) => {
    if (!Array.isArray(allProds) || allProds.length === 0) return [];
    const lowerSlug = catSlug ? catSlug.toLowerCase() : '';
    
    // Broad shop matching
    if (lowerSlug === 'shop' || lowerSlug === 'all') {
      return allProds;
    }

    const matched = allProds.filter(p => {
      const pCat = p.category ? p.category.toLowerCase() : '';
      return pCat === lowerSlug || pCat.includes(lowerSlug) || lowerSlug.includes(pCat);
    });

    if (matched.length > 0) return matched;
    // Fallback: return all products if none matched specific slug
    return allProds;
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const displayCategory = name?.toLowerCase() === 'all'
    ? 'All Products'
    : name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

  useEffect(() => {
    let isMounted = true;

    const initialAll = getInitialProducts();
    if (initialAll.length > 0) {
      setProducts(filterCategory(initialAll, name));
      setLoading(false);
    }

    const fetchCategory = async () => {
      const cached = await getCachedProducts();
      if (isMounted && Array.isArray(cached) && cached.length > 0) {
        setProducts(filterCategory(cached, name));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API}/products`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(filterCategory(data, name));
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error('Category fetch error:', err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategory();
    return () => { isMounted = false; };
  }, [name]);

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
    <>
      <SEO title={`${displayCategory} Collection — SparkRoot`} description={`Explore our exclusive range of ${displayCategory.toLowerCase()} handpicked just for you at SPARKROOT.`} />
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200 gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
                {displayCategory} <span className="text-gray-400">Collection</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                Showing luxury items curated for {displayCategory.toLowerCase()}.
              </p>
            </div>
            <span suppressHydrationWarning className="px-3.5 py-1.5 bg-black text-white text-xs font-bold rounded-full">
              {products.length} Items Available
            </span>
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col bg-white border border-gray-200 p-4 rounded-2xl animate-pulse space-y-3">
                  <div className="aspect-square bg-gray-200 rounded-xl" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-3xl">
              <p className="text-base font-bold text-slate-700">No products available in this category right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => {
                const isLiked = !!likedProducts[product.id];
                return (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative"
                  >
                    {/* Top Action Icons */}
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleLike(e, product)}
                        className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-gray-600 hover:text-red-500 hover:scale-110 transition cursor-pointer shadow-xs"
                      >
                        <Heart size={14} className={isLiked ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleAddClick(e, product)}
                        className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-gray-600 hover:text-black hover:scale-110 transition cursor-pointer shadow-xs"
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>

                    {/* Product Image */}
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

                    {/* Content */}
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

                    {/* Buy Now Button */}
                    <div className="mt-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => handleBuyNow(e, product)}
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
          )}

        </div>
      </div>
    </>
  );
}
