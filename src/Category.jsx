import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Heart } from 'lucide-react';

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
        const res = await fetch(`http://localhost:5000/api/products?category=${encodeURIComponent(name)}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Category fetch error:", err);
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

  const handleLike = (e, productId) => {
    e.stopPropagation();
    toggleLike(productId);
  };

  return (
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
                className="group cursor-pointer flex flex-col"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200 mb-4 rounded-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='533' fill='%23f1f5f9'%3E%3Crect width='400' height='533'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='16'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  
                  {/* Heart/Wishlist Button */}
                  <button
                    onClick={(e) => handleLike(e, product.id)}
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
                  
                  {product.stock > 0 && (
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center">
                      <button
                        onClick={(e) => handleAddClick(e, product)}
                        className="w-full bg-black text-white font-bold py-3 rounded-none flex items-center justify-center gap-2 hover:bg-slate-800 transition uppercase tracking-widest text-xs"
                      >
                        <ShoppingCart size={16} /> Add to Cart
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-black line-clamp-1 mb-1 group-hover:text-slate-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-slate-900 font-semibold">PKR {product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
