'use client';

import React, { useState } from 'react';
import { Heart, Headset, Phone, Mail, Clock, Send, ShoppingCart, Zap, X } from 'lucide-react';
import { useCart } from '../../CartContext';
import { useToast } from '../ToastProvider';

export default function UserSupportWishlistTabs({ activeTab, wishlistCount, onNavigate }) {
  const { likedProducts, likedProductsData, toggleLike, addToCart } = useCart();
  const { addToast } = useToast();
  
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  const likedIds = Object.keys(likedProducts || {}).filter(id => likedProducts[id]);
  const likedItems = likedIds.map(id => likedProductsData?.[id] || {
    id,
    name: `Saved Product #${id}`,
    price: 0,
    image: '/images/categories/electronics.png'
  });

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage) return;
    setSentSuccess(true);
    addToast('Support inquiry sent successfully! Our concierge will contact you within 1 hour.', 'success');
    setSupportMessage('');
    setSupportSubject('');
    setTimeout(() => setSentSuccess(false), 5000);
  };

  if (activeTab === 'wishlist') {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={22} />
              <span>My Saved Wishlist</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">Manage all your saved luxury items in one place.</p>
          </div>
          <span className="bg-rose-50 text-rose-600 font-bold text-xs px-3 py-1 rounded-full border border-rose-200">
            {likedItems.length} Items
          </span>
        </div>

        {likedItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-gray-200 p-8">
            <Heart size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 uppercase">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">Browse our catalog to save your favorite products.</p>
            <button
              onClick={() => onNavigate('/')}
              className="px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {likedItems.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-2xl p-4 flex flex-col justify-between bg-white hover:shadow-md transition">
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleLike(item.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:text-rose-600 transition shadow-xs"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate uppercase">{item.name}</h4>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    PKR {Number(item.price || 0).toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      addToCart(item);
                      addToast('Added to Cart', 'success');
                    }}
                    className="flex-1 py-2 bg-slate-950 text-amber-300 font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
                  >
                    <ShoppingCart size={13} />
                    <span>Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('buyNowItem', JSON.stringify({ ...item, quantity: 1, cartKey: `buynow_${item.id}` }));
                      onNavigate('/checkout');
                    }}
                    className="flex-1 py-2 bg-black text-white font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition"
                  >
                    <Zap size={13} />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-extrabold uppercase text-slate-900 tracking-tight flex items-center gap-2">
          <Headset className="text-amber-500" size={22} />
          <span>SparkRoot Concierge Support</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">We are here 24/7 to assist you with orders, returns, and product questions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col items-center text-center">
          <Phone className="text-slate-800 mb-2" size={24} />
          <h4 className="text-xs font-bold uppercase text-slate-900">Phone & WhatsApp</h4>
          <p className="text-xs font-extrabold text-slate-800 mt-1">+92 346 7921114</p>
          <p className="text-[10px] text-slate-400 mt-0.5">24/7 Priority Helpline</p>
        </div>

        <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col items-center text-center">
          <Mail className="text-slate-800 mb-2" size={24} />
          <h4 className="text-xs font-bold uppercase text-slate-900">Email Support</h4>
          <p className="text-xs font-extrabold text-slate-800 mt-1">support@sparkroot.com</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Response within 1 hour</p>
        </div>

        <div className="bg-slate-50 border border-gray-200/80 rounded-2xl p-4 flex flex-col items-center text-center">
          <Clock className="text-slate-800 mb-2" size={24} />
          <h4 className="text-xs font-bold uppercase text-slate-900">Working Hours</h4>
          <p className="text-xs font-extrabold text-slate-800 mt-1">Mon - Sun (24 Hours)</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Always Online</p>
        </div>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase text-slate-900 mb-3">Send Us a Support Message</h3>
        {sentSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
            ✓ Message received! A support representative will call or email you shortly.
          </div>
        )}
        <form onSubmit={handleSupportSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Subject / Order ID</label>
            <input
              type="text"
              placeholder="e.g. Order #SR-12345 or Return Request"
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Message Details</label>
            <textarea
              rows={4}
              placeholder="Describe your question or issue..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-slate-950 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send size={14} />
            <span>Submit Inquiry</span>
          </button>
        </form>
      </div>
    </div>
  );
}
