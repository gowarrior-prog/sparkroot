// src/pages/Wishlist.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, X, Zap } from 'lucide-react';
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';
import SEO from './SEO';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';

export default function Wishlist() {
  const { addToCart, likedProducts, likedProductsData, toggleLike } = useCart();
  const navigate = useNavigate();
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from API to match liked IDs
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
        if (res.ok) {
          const data = await res.json();
          setApiProducts(data);
        } else {
          setApiProducts(fallbackProducts);
        }
      } catch (err) {
        console.error('Failed to fetch products for wishlist:', err);
        setApiProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get liked product IDs
  const likedIds = Object.keys(likedProducts).filter(id => likedProducts[id]);

  // Build liked items from API data first, then fallback products, then saved data
  const likedItems = likedIds.map(id => {
    const numId = parseInt(id);
    const fromApi = apiProducts.find(p => p.id === numId || p.id === id);
    if (fromApi) return fromApi;
    const fromFallback = fallbackProducts.find(p => p.id === numId);
    if (fromFallback) return fromFallback;
    if (likedProductsData[id]) return likedProductsData[id];
    return {
      id: numId || id,
      name: `Product #${id}`,
      price: 0,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EProduct%3C/text%3E%3C/svg%3E",
    };
  });

  const handleRemove = (id) => {
    toggleLike(id);
  };

  const handleBuyNow = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    navigate('/checkout');
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    addToCart(item);
    alert('Added to cart!');
  };

  return (
    <>
      <SEO title="My Wishlist" description="View and manage your favorite SPARKROOT products in your wishlist." />
      <div className="min-h-screen bg-white text-slate-900 pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              My Wishlist <Heart className="inline text-black fill-black ml-2" size={36} />
            </h1>
            <Link
              to="/"
              className="text-slate-500 hover:text-black font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            >
              Continue Shopping →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : likedItems.length === 0 ? (
            <div className="text-center py-20">
              <Heart size={80} className="mx-auto mb-6 text-slate-300" />
              <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">Your Wishlist is Empty</h2>
              <p className="text-lg text-slate-500 mb-8 font-medium">
                You haven't liked any products yet. Start exploring!
              </p>
              <Link
                to="/"
                className="inline-flex px-10 py-4 bg-black hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm transition-all shadow-sm"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {likedItems.map(item => (
                <div
                  key={item.id}
                  className="
                    bg-white border border-slate-200 
                    rounded-sm overflow-hidden shadow-sm hover:shadow-md
                    transition-all duration-300 flex flex-col justify-between cursor-pointer
                  "
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-slate-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition border border-slate-200 shadow-sm"
                      title="Remove from Wishlist"
                    >
                      <X size={18} className="text-black" />
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-black mb-1 truncate uppercase tracking-widest">
                        {item.name}
                      </h3>
                      <p className="text-slate-900 font-extrabold text-lg mb-3">
                        PKR {Number(item.price).toLocaleString('en-PK')}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <button
                        onClick={(e) => handleBuyNow(e, item)}
                        className="
                          w-full py-2.5 bg-black hover:bg-slate-800 
                          text-white font-bold uppercase tracking-widest text-xs rounded-none transition-all
                          flex items-center justify-center gap-2 shadow-xs
                        "
                      >
                        <Zap size={15} />
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, item)}
                        className="
                          w-full py-2 bg-slate-100 border border-slate-300 hover:bg-slate-200 
                          text-black font-bold uppercase tracking-widest text-xs rounded-none transition-all
                          flex items-center justify-center gap-2
                        "
                      >
                        <ShoppingCart size={15} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}