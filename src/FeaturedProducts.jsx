import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import { getCachedProducts } from './productStore';
import { products as fallbackProducts } from './dataproducts';

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCachedProducts().then((data) => {
      if (!isMounted) return;
      if (Array.isArray(data) && data.length > 0) {
        let display = data.filter(p => p.featured);
        if (display.length === 0) display = data.slice(0, 12);
        setProducts(display);
      } else {
        setProducts(fallbackProducts.slice(0, 12));
      }
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setProducts(fallbackProducts.slice(0, 12));
      setLoading(false);
    });

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

  if (loading && products.length === 0) {
    return (
      <section id="featured-products" className="py-12 md:py-24 bg-white relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16">
            <div className="h-10 w-64 bg-slate-200 rounded animate-pulse" />
            <div className="h-5 w-48 bg-slate-200 rounded animate-pulse mt-4 md:mt-0" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col bg-white border border-slate-200/80 p-3 rounded-xl">
                <div className="relative aspect-[3/4] bg-slate-200 rounded-lg animate-pulse mb-3 overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse" />
                  <div className="h-9 w-full bg-slate-200 rounded-md animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-12 md:py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Featured <span className="text-slate-400">Collection</span>
          </h2>
          <p className="text-slate-500 mt-4 md:mt-0 max-w-sm text-center md:text-right font-medium">
            Curated pieces from our latest arrivals, exclusively selected for you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-6 gap-y-8 sm:gap-y-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group cursor-pointer flex flex-col bg-white border border-slate-200/80 p-2.5 sm:p-3.5 rounded-xl shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-fade-in"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200 mb-3 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, product)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 hover:bg-white hover:scale-110 active:scale-90 transition-all z-10 shadow-sm cursor-pointer"
                  title="Wishlist"
                >
                  <Heart size={18} className={likedProducts[product.id] ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                </button>

                {/* Out of Stock Overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-black text-white font-black px-4 py-2 rounded uppercase tracking-wider text-xs shadow-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {product.category || 'Luxury'}
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-black line-clamp-1 mb-1 group-hover:text-slate-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-slate-900 font-extrabold text-base sm:text-lg mb-3">
                    PKR {Number(product.price).toLocaleString('en-PK')}
                  </p>
                </div>

                <div className="space-y-2 mt-auto pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleBuyNow(e, product)}
                    className="w-full bg-black text-white font-black py-2.5 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all uppercase tracking-widest text-xs shadow-xs cursor-pointer"
                  >
                    <Zap size={15} className="text-amber-300" /> Buy Now
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleAddClick(e, product)}
                    className="w-full bg-slate-100 text-black border border-slate-300 font-bold py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95 transition-all uppercase tracking-widest text-xs cursor-pointer"
                  >
                    <ShoppingCart size={15} /> Add to Cart
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