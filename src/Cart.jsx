// src/pages/Cart.jsx
import { useCart } from './CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cartItems, addToCart, decreaseQuantity, removeItem, cartCount } = useCart();

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 170;
  const total = subtotal + delivery;

  const handleRemoveItem = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeItem(id);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag size={80} className="mx-auto mb-6 text-slate-300" />
          <h1 className="text-4xl font-black mb-4 uppercase tracking-tight">Your Cart is Empty</h1>
          <p className="text-lg text-slate-500 mb-8 font-medium">
            Looks like you haven't added anything yet. Let's change that!
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-black hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 md:mb-0 uppercase tracking-tight">
            Your Cart
            <span className="text-slate-400 ml-3">({cartCount})</span>
          </h1>
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="
                  flex flex-col sm:flex-row gap-6 
                  bg-white border border-slate-200 
                  rounded-sm p-6 transition-all duration-300 hover:border-slate-400 hover:shadow-sm
                "
              >
                {/* Image */}
                <div className="w-full sm:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-sm border border-slate-200"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-black">{item.name}</h3>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <p className="text-black font-black text-xl mb-4">
                    PKR {item.price.toFixed(0)}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-sm transition border border-slate-200 disabled:opacity-50"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>

                    <span className="text-lg font-black min-w-[40px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 flex items-center justify-center bg-black hover:bg-slate-800 text-white rounded-sm transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Total for this item */}
                  <p className="text-slate-500 font-medium text-sm">
                    Item Total: <span className="font-black text-black">PKR {(item.price * item.quantity).toFixed(0)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <div className="
              lg:sticky lg:top-24 
              bg-white border border-slate-200 
              rounded-sm p-6 shadow-sm
            ">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 pb-4 border-b border-slate-200">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-black font-bold">PKR {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery Charges</span>
                  <span className="text-black font-bold">PKR {delivery}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-black">PKR {total.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6">
                <p className="text-xs text-slate-400 text-center font-bold uppercase tracking-widest">
                  Flat delivery charges: PKR 170
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="
                  w-full block text-center py-4 bg-black 
                  text-white font-bold uppercase tracking-widest text-sm
                  hover:bg-slate-800
                  transition-all duration-300 shadow-sm
                ">
                  Proceed to Checkout
                </Link>

                <Link
                  to="/"
                  className="
                    w-full block py-4 bg-transparent border-2 border-slate-200 
                    text-slate-600 font-bold uppercase tracking-widest text-sm text-center
                    hover:bg-slate-50 hover:border-slate-400 
                    transition-all duration-300
                  "
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}