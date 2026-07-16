import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { useCart } from './CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-4 uppercase tracking-tight">Product Not Found</h1>
          <p className="text-slate-500 mb-8 font-medium">The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')} className="px-8 py-3 bg-black rounded-none text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-black mb-8 transition group font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Product Image */}
          <div className="bg-white rounded-sm overflow-hidden border border-slate-200 relative shadow-sm aspect-square md:aspect-auto">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' fill='%23f1f5f9'%3E%3Crect width='600' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-size='18'%3EImage Unavailable%3C/text%3E%3C/svg%3E";
              }}
            />
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-black text-white font-bold px-6 py-3 rounded-sm uppercase tracking-wider shadow-sm">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-slate-400 font-bold tracking-widest uppercase mb-2 text-xs">{product.category}</p>
            <h1 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight text-black">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-black text-black">PKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xl text-slate-400 line-through font-bold">PKR {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Star size={18} className="fill-black text-black" />
              <span className="text-black font-black">4.8</span>
              <span className="text-slate-500 font-medium">/ 5.0 (24 reviews)</span>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8 font-medium">
              {product.description || "Premium quality product with excellent craftsmanship. Perfect for gifting or personal collection. Made with the finest materials for lasting elegance."}
            </p>
            
            {product.stock > 0 && product.stock <= 5 && (
              <p className="text-slate-500 mb-4 flex items-center gap-2 font-bold text-sm uppercase tracking-widest">
                ⚠️ Only {product.stock} items left in stock!
              </p>
            )}

            {/* Add to Cart Button */}
            <button 
              className={`py-4 px-8 rounded-none font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition text-sm shadow-sm ${
                product.stock > 0 
                  ? 'bg-black text-white hover:bg-slate-800' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            {/* Extra Info */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-xs font-bold uppercase tracking-widest">
              <div className="bg-white border border-slate-200 rounded-sm p-4 text-center shadow-sm">
                <Truck size={22} className="mx-auto mb-2 text-black" />
                <p className="text-slate-400 mb-1">Delivery</p>
                <p className="text-black">3-5 days</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-sm p-4 text-center shadow-sm">
                <RotateCcw size={22} className="mx-auto mb-2 text-black" />
                <p className="text-slate-400 mb-1">Returns</p>
                <p className="text-black">7 days</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-sm p-4 text-center shadow-sm">
                <Shield size={22} className="mx-auto mb-2 text-black" />
                <p className="text-slate-400 mb-1">Warranty</p>
                <p className="text-black">1 year</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}