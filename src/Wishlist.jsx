// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { useCart } from './CartContext'; // adjust path
import { useState, useEffect } from 'react';
import { products } from './dataproducts'; // ← Import real products

export default function Wishlist() {
  const { addToCart, likedProducts, toggleLike } = useCart();

  // Get only liked products with REAL data
  const likedItems = Object.keys(likedProducts)
    .filter(id => likedProducts[id])
    .map(id => {
      // Find real product by id
      const realProduct = products.find(p => p.id === parseInt(id));
      return realProduct || {
        id: parseInt(id),
        name: `Product ${id} (not found)`,
        price: 25000,
        image: "https://via.placeholder.com/300?text=Product+Not+Found",
      };
    });

  return (
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

        {likedItems.length === 0 ? (
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
                      e.target.src = "https://via.placeholder.com/300?text=Image+Failed";
                    }}
                  />
                  <button
                    onClick={() => toggleLike(item.id)}
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
  );
}