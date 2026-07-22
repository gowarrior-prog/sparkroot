import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import SEO from './SEO';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';

export default function Category() {
  const { name } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format category name for display (e.g. "mobile-accessories" -> "Mobile Accessories")
  const displayCategory = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/products?category=${encodeURIComponent(name)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setProducts(data);
          } else {
            // Fallback matching category or general fallback
            const filtered = fallbackProducts.filter(p => 
              p.category?.toLowerCase() === name.toLowerCase() ||
              p.name.toLowerCase().includes(name.toLowerCase())
            );
            setProducts(filtered.length > 0 ? filtered : fallbackProducts.slice(0, 12));
          }
        } else {
          setProducts(fallbackProducts.slice(0, 12));
        }
      } catch (err) {
        console.error("Category fetch error:", err);
        setProducts(fallbackProducts.slice(0, 12));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [name]);

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
    <>
      <SEO title={`${displayCategory} Collection`} description={`Explore our exclusive range of ${displayCategory.toLowerCase()} handpicked just for you at SPARKROOT.`} />
      <div className="min-h-screen bg-white text-slate-900 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              <span className="text-slate-400">{displayCategory}</span> Collection
            </h1>
            <p className="text-slate-500 mt-4 md:mt-0 max-w-md text-center md:text-right font-medium">
              Explore our exclusive range of {displayCategory.toLowerCase()} handpicked just for you.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-slate-500 font-medium">No products available in this category right now.</p>
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
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
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
    </>
  );
}
