'use client';

// src/pages/Cart.jsx
import { useState } from 'react';
import { useCart } from './CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Zap, AlertTriangle, X } from 'lucide-react';
import { Link, useNavigate } from './lib/routerCompat';

export default function Cart() {
  const { cartItems, addToCart, decreaseQuantity, removeItem, cartCount } = useCart();
  const navigate = useNavigate();

  // State for confirm modal & animated delete ring
  const [confirmItem, setConfirmItem] = useState(null);
  const [deletingMap, setDeletingMap] = useState({});

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  // 1. Click delete icon -> open confirm modal
  const handleRemoveClick = (item) => {
    setConfirmItem(item);
  };

  // 2. User confirms deletion -> trigger ring animation, then remove
  const handleConfirmDelete = () => {
    if (!confirmItem) return;
    const itemKey = confirmItem.cartKey || confirmItem.id;
    
    // Close modal
    setConfirmItem(null);

    // Set deleting ring state
    setDeletingMap(prev => ({ ...prev, [itemKey]: true }));

    // After ring animation (~800ms), remove item & trigger top toast
    setTimeout(() => {
      removeItem(itemKey);
      setDeletingMap(prev => {
        const copy = { ...prev };
        delete copy[itemKey];
        return copy;
      });
    }, 800);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-32 px-4 md:px-8 relative">
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
            {cartItems.map((item) => {
              const itemKey = item.cartKey || item.id;
              const isDeleting = deletingMap[itemKey];

              return (
                <div
                  key={itemKey}
                  className={`
                    flex flex-col sm:flex-row gap-6 
                    bg-white border border-slate-200 
                    rounded-sm p-6 transition-all duration-300 hover:border-slate-400 hover:shadow-sm relative
                    ${isDeleting ? 'opacity-50 scale-98 pointer-events-none' : ''}
                  `}
                >
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-sm border border-slate-200"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="text-base sm:text-lg font-bold text-black cursor-pointer hover:text-slate-600 transition"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >
                        {item.name}
                      </h3>

                      {/* Delete Button with Ring Animation */}
                      <button
                        type="button"
                        onClick={() => handleRemoveClick(item)}
                        disabled={isDeleting}
                        className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-full hover:bg-red-50 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px]"
                        title="Remove item"
                      >
                        {isDeleting ? (
                          /* Animated Ring Loader replace icon */
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>

                    {/* Selected Size & Color */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 mb-3">
                        {item.selectedSize && (
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            Size: <strong className="text-black">{item.selectedSize}</strong>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                            Color: <strong className="text-black">{item.selectedColor}</strong>
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-black font-extrabold text-lg sm:text-xl mb-3">
                      PKR {Number(item.price).toLocaleString('en-PK')}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mb-4">
                      <button
                        onClick={() => decreaseQuantity(itemKey)}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-md transition border border-slate-200 disabled:opacity-50 cursor-pointer"
                        disabled={item.quantity <= 1 || isDeleting}
                      >
                        <Minus size={14} />
                      </button>

                      <span className="text-base font-bold min-w-[32px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => addToCart(item, { size: item.selectedSize, color: item.selectedColor, quantity: 1, silent: true })}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-black hover:bg-slate-800 text-white rounded-md transition cursor-pointer"
                        disabled={isDeleting}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total for this item */}
                    <p className="text-slate-500 font-medium text-sm">
                      Item Total: <span className="font-black text-black">PKR {Number(item.price * item.quantity).toLocaleString('en-PK')}</span>
                    </p>
                  </div>
                </div>
              );
            })}
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
                  <span className="text-black font-bold">PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold uppercase">Free</span>
                </div>
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>
                    <span className="text-black">PKR {total.toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mb-6">
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2 border border-emerald-200 text-center font-bold uppercase tracking-widest rounded-xs">
                  ✓ Free Delivery Applied (No extra charges)
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  to="/checkout"
                  className="
                  w-full flex items-center justify-center gap-2 py-4 bg-black 
                  text-white font-bold uppercase tracking-widest text-sm
                  hover:bg-slate-800
                  transition-all duration-300 shadow-sm
                ">
                  <Zap size={18} /> Proceed to Checkout
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

      {/* Luxury Confirmation Modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-slate-100 transform scale-100 transition-all text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={26} strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1.5 tracking-tight">Remove From Cart?</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800 font-semibold">"{confirmItem.name}"</strong> from your shopping cart?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmItem(null)}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase rounded-2xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs tracking-wider uppercase rounded-2xl shadow-lg transition cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}