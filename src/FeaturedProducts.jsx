import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Heart, Zap } from 'lucide-react';
import { API } from './api';
import { products as fallbackProducts } from './dataproducts';

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { addToCart, toggleLike, likedProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/products`);
      if (res.ok) {
        const data = await res.json();
        let displayProducts = data.filter(p => p.featured);
        if (displayProducts.length === 0) {
          displayProducts = data.slice(0, 12);
        }
        setProducts(displayProducts.length > 0 ? displayProducts : fallbackProducts.slice(0, 12));
      } else {
        setProducts(fallbackProducts.slice(0, 12));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts(fallbackProducts.slice(0, 12));
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <section id="featured-products" className="py-20 bg-white flex justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  return (
    <section id="featured-products" className="py-12 md:py-24 bg-white relative border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
            Featured <span className="text-slate-400">Collection</span>
          </h2>
          <p className="text-slate-500 mt-4 md:mt-0 max-w-sm text-center md:text-right font-medium">
            Curated pieces from our latest arrivals, exclusively selected for you.
          </p>
        </div>

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
                  fetchPriority="high"
                  decoding="async"
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
                  title="Wishlist"
                >
                  <Heart size={18} className={likedProducts[product.id] ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
                </button>

                {/* Out of stock overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-black text-white font-bold px-4 py-2 rounded-sm uppercase tracking-wider text-xs shadow-xl">
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

                {/* Card action buttons: Buy Now & Add to Cart */}
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
      </div>
    </section>
  );
}