// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';
import SEO from './SEO';

export default function Wishlist() {
  const { addToCart, likedProducts, likedProductsData, toggleLike } = useCart();
  const [apiProducts, setApiProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from API to match liked IDs
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          setApiProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch products for wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get liked product IDs
  const likedIds = Object.keys(likedProducts).filter(id => likedProducts[id]);

  // Build liked items from API data first, then saved data, then fallback
  const likedItems = likedIds.map(id => {
    const numId = parseInt(id);
    // Try API data first (most accurate, has real images)
    const fromApi = apiProducts.find(p => p.id === numId);
    if (fromApi) return fromApi;
    // Try saved data from when user liked it
    if (likedProductsData[id]) return likedProductsData[id];
    // Fallback
    return {
      id: numId,
      name: `Product #${id}`,
      price: 0,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EProduct%3C/text%3E%3C/svg%3E",
    };
  });

  const handleRemove = (id) => {
    toggleLike(id);
  };

  return (
    <>
      <SEO title="My Wishlist" description="View and manage your favorite SPARKROOT products in your wishlist." />
      <div className="min-h-screen bg-white text-slate-900 pt-36 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              My Wishlist <Heart className="inline text-black fill-black" size={36} />
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
                Browse Featured Collection
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
                    transition-all duration-300 hover:-translate-y-1
                  "
                >
                  <div className="aspect-[3/4] relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition border border-slate-200"
                    >
                      <X size={18} className="text-black" />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold text-black mb-2 truncate uppercase tracking-widest">
                      {item.name}
                    </h3>
                    <p className="text-black font-black mb-4">
                      PKR {item.price.toLocaleString('en-PK')}
                    </p>

                    <button
                      onClick={() => addToCart(item)}
                      className="
                        w-full py-3 bg-black hover:bg-slate-800 
                        text-white font-bold uppercase tracking-widest text-xs rounded-none transition-all
                        flex items-center justify-center gap-2
                      "
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
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