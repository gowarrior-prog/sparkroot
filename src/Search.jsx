import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Heart, Zap, Search as SearchIcon } from 'lucide-react';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      const qLower = query.toLowerCase().trim();

      try {
        const res = await fetch(`${API}/products?search=${encodeURIComponent(query)}`);
        let apiResults = [];
        if (res.ok) {
          apiResults = await res.json();
        }

        // Local fallback filter if API returns nothing or as supplement
        const localMatches = fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(qLower) || 
          (p.category && p.category.toLowerCase().includes(qLower)) ||
          (p.description && p.description.toLowerCase().includes(qLower))
        );

        // Combine unique results by name (handles mixed ID types - numeric local vs UUID API)
        const combinedMap = new Map();
        [...apiResults, ...localMatches].forEach(item => {
          const key = item.name ? item.name.toLowerCase().trim() : String(item.id);
          if (!combinedMap.has(key)) {
            combinedMap.set(key, item);
          }
        });

        setProducts(Array.from(combinedMap.values()));
      } catch (err) {
        console.error("Search error:", err);
        const localMatches = fallbackProducts.filter(p => 
          p.name.toLowerCase().includes(qLower) || 
          (p.category && p.category.toLowerCase().includes(qLower)) ||
          (p.description && p.description.toLowerCase().includes(qLower))
        );
        setProducts(localMatches);
      } finally {
        setLoading(false);
      }
    };
    
    if (query) {
      fetchSearch();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

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
    <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            {query ? <>Search Results for <span className="text-slate-400">"{query}"</span></> : <span className="text-slate-400">Search Products</span>}
          </h1>
          {query && <p className="text-slate-500 font-medium mt-2">Found {products.length} product(s) matching your request</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 border border-slate-200 rounded-sm">
            <SearchIcon size={64} className="mx-auto mb-4 text-slate-300" />
            <p className="text-2xl font-black mb-2 uppercase">No Products Found</p>
            <p className="text-slate-500 font-medium mb-6">We couldn't find any products matching "{query}". Try searching for something else.</p>
            <button onClick={() => navigate('/')} className="px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs">
              Back to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer flex flex-col bg-white border border-slate-100 p-3 rounded-md shadow-xs hover:shadow-md transition-all duration-300"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200 mb-3 rounded-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Heart/Wishlist Button */}
                  <button
                    onClick={(e) => handleLike(e, product)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 hover:bg-white transition-all z-10 shadow-sm"
                  >
                    <Heart size={18} className={likedProducts[product.id] ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                  </button>

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-black text-white font-bold px-4 py-2 rounded-sm uppercase tracking-wider text-xs shadow-sm">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{product.category || 'Luxury'}</p>
                    <h3 className="text-base font-bold text-black line-clamp-1 mb-1 group-hover:text-slate-600 transition">
                      {product.name}
                    </h3>
                    <p className="text-slate-900 font-extrabold text-lg mb-3">PKR {Number(product.price).toLocaleString('en-PK')}</p>
                  </div>

                  {/* Both Buy Now & Add to Cart buttons */}
                  <div className="space-y-2 mt-auto pt-2">
                    <button
                      onClick={(e) => handleBuyNow(e, product)}
                      className="w-full bg-black text-white font-bold py-2.5 px-3 rounded-none flex items-center justify-center gap-2 hover:bg-slate-800 transition uppercase tracking-widest text-xs shadow-xs"
                    >
                      <Zap size={15} /> Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddClick(e, product)}
                      className="w-full bg-slate-100 text-black border border-slate-300 font-bold py-2 px-3 rounded-none flex items-center justify-center gap-2 hover:bg-slate-200 transition uppercase tracking-widest text-xs"
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
