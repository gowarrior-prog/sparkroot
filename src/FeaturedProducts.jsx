import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Package, Heart } from 'lucide-react';

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
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        // Show only featured products, or all if none are featured (up to 8)
        let displayProducts = data.filter(p => p.featured);
        if (displayProducts.length === 0) {
          displayProducts = data.slice(0, 8);
        }
        setProducts(displayProducts);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    alert('Added to cart!');
  };

  const handleLike = (e, productId) => {
    e.stopPropagation();
    toggleLike(productId);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  if (products.length === 0) {
    return null; // Don't show the section if no products in DB at all
  }

  return (
    <section className="py-12 md:py-24 bg-white relative border-t border-slate-200">
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
              className="group cursor-pointer flex flex-col"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-50 border border-slate-200 mb-4 rounded-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    fetchPriority="high"
                    decoding="async"
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

                {/* Out of stock overlay */}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-black text-white font-bold px-4 py-2 rounded-sm uppercase tracking-wider text-xs shadow-xl">
                      Out of Stock
                    </span>
                  </div>
                )}
                
                {/* Hover actions */}
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
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{product.category}</p>
                <h3 className="text-lg font-bold text-black line-clamp-1 mb-1 group-hover:text-slate-600 transition">
                  {product.name}
                </h3>
                <p className="text-slate-900 font-semibold">PKR {product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}