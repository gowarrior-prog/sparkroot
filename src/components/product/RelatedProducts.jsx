'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from '../../lib/routerCompat';
import { ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import { API } from '../../api';
import { useCart } from '../../CartContext';

export default function RelatedProducts({ currentProductId, category }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();

  useEffect(() => {
    let isMounted = true;

    const fetchRelated = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const cleanCategory = category.trim().toLowerCase();
        // 1. Fetch strictly by category from backend
        const res = await fetch(`${API}/products?category=${encodeURIComponent(cleanCategory)}`);
        if (res.ok) {
          const data = await res.json();
          // Filter strictly: must NOT be current product AND must match the exact category
          const sameCategoryOnly = Array.isArray(data)
            ? data.filter(
                (p) =>
                  p.id !== currentProductId &&
                  p.category?.trim().toLowerCase() === cleanCategory
              )
            : [];

          if (isMounted) {
            setRelated(sameCategoryOnly.slice(0, 4));
          }
        } else {
          if (isMounted) setRelated([]);
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
        if (isMounted) setRelated([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentProductId && category) {
      fetchRelated();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [currentProductId, category]);

  // If loading is done and there are no other products in this category, do NOT show anything
  if (!loading && related.length === 0) return null;

  const categoryLabel = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Related Items';

  return (
    <section className="mt-16 md:mt-24 pt-12 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 block mb-1">
            Related Recommendations
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            More in {categoryLabel}
          </h2>
        </div>

        {category && (
          <button
            onClick={() => {
              navigate(`/category/${encodeURIComponent(category.toLowerCase().trim())}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-700 hover:text-black transition group cursor-pointer"
          >
            View All {categoryLabel}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 animate-pulse space-y-3">
              <div className="aspect-[3/4] bg-slate-200 rounded-lg" />
              <div className="h-3 w-16 bg-slate-200 rounded" />
              <div className="h-4 w-3/4 bg-slate-200 rounded" />
              <div className="h-5 w-1/2 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {related.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                navigate(`/product/${item.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer flex flex-col bg-white border border-slate-200/80 p-2.5 sm:p-3.5 rounded-xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200 mb-3 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id, item);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all z-10 shadow-xs cursor-pointer"
                  title="Wishlist"
                >
                  <Heart
                    size={16}
                    className={likedProducts[item.id] ? 'fill-red-500 text-red-500' : 'text-slate-400'}
                  />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                    {item.category || categoryLabel}
                  </p>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-black transition">
                    {item.name}
                  </h3>
                  <p className="text-slate-900 font-bold text-sm sm:text-base mb-3 tracking-tight">
                    PKR {Number(item.price).toLocaleString('en-PK')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  className="w-full bg-slate-100 hover:bg-black hover:text-white text-slate-900 border border-slate-200 font-semibold py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition text-xs uppercase tracking-wider cursor-pointer"
                >
                  <ShoppingCart size={14} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
