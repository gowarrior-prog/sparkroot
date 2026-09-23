'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from './lib/routerCompat';
import CartItemCard from './components/cart/CartItemCard';
import CartSummaryCard from './components/cart/CartSummaryCard';
import DeleteConfirmModal from './components/cart/DeleteConfirmModal';

export default function Cart() {
  const { cartItems, addToCart, decreaseQuantity, removeItem, cartCount } = useCart();
  const navigate = useNavigate();

  const [confirmItem, setConfirmItem] = useState(null);
  const [deletingMap, setDeletingMap] = useState({});

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 0;
  const total = subtotal + delivery;

  const handleRemoveClick = (item) => {
    setConfirmItem(item);
  };

  const handleConfirmDelete = () => {
    if (!confirmItem) return;
    const itemKey = confirmItem.cartKey || confirmItem.id;
    setConfirmItem(null);
    setDeletingMap(prev => ({ ...prev, [itemKey]: true }));

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
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemKey = item.cartKey || item.id;
              return (
                <CartItemCard
                  key={itemKey}
                  item={item}
                  itemKey={itemKey}
                  isDeleting={deletingMap[itemKey]}
                  handleRemoveClick={handleRemoveClick}
                  decreaseQuantity={decreaseQuantity}
                  addToCart={addToCart}
                  onNavigate={navigate}
                />
              );
            })}
          </div>

          <CartSummaryCard cartCount={cartCount} subtotal={subtotal} total={total} />
        </div>
      </div>

      <DeleteConfirmModal
        confirmItem={confirmItem}
        setConfirmItem={setConfirmItem}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}