'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Headset, Phone, Mail, Clock, Send, ShoppingCart, Zap, X, CheckCircle2, User, MapPin } from 'lucide-react';
import { useCart } from '../../CartContext';
import { useToast } from '../ToastProvider';
import { API } from '../../api';

export default function UserSupportWishlistTabs({ activeTab, user, wishlistCount, onNavigate }) {
  const [isMounted, setIsMounted] = useState(false);
  const cartContext = useCart() || {};
  const likedProducts = cartContext.likedProducts || {};
  const likedProductsData = cartContext.likedProductsData || {};
  const toggleLike = cartContext.toggleLike || (() => {});
  const addToCart = cartContext.addToCart || (() => {});

  const toastContext = useToast() || {};
  const addToast = toastContext.addToast || (() => {});

  // 5 Form Fields identical to Contact Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: (user.phone && user.phone !== 'Not Added') ? user.phone : '',
        address: user.address || '',
        message: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      if (addToast) addToast('Please fill in Name, Email, and Message.', 'delete');
      return;
    }

    setLoading(true);

    try {
      // Post to /api/contact matching Contact Form process exactly
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSubmittedData({ ...formData, createdAt: new Date().toLocaleString() });
        if (addToast) addToast('Your support inquiry has been sent to SparkRoot Concierge!', 'success', 'Message Sent');
        setFormData(prev => ({ ...prev, message: '' }));
      } else {
        const data = await res.json();
        if (addToast) addToast(data.error || 'Failed to send message.', 'delete');
      }
    } catch (err) {
      console.error('Contact support error:', err);
      if (addToast) addToast('Network error sending inquiry.', 'delete');
    } finally {
      setLoading(false);
    }
  };

  const likedIds = isMounted ? Object.keys(likedProducts || {}).filter(id => likedProducts[id]) : [];
  const likedItems = likedIds.map(id => likedProductsData?.[id] || {
    id,
    name: `Saved Product #${id}`,
    price: 0,
    image: '/images/categories/electronics.png'
  });

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
              className="px-6 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition cursor-pointer"
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
                      className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-slate-700 hover:text-rose-600 transition shadow-xs cursor-pointer"
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
                      if (addToast) addToast('Added to Cart', 'success');
                    }}
                    className="flex-1 py-2 bg-slate-950 text-amber-300 font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <ShoppingCart size={13} />
                    <span>Cart</span>
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('buyNowItem', JSON.stringify({ ...item, quantity: 1, cartKey: `buynow_${item.id}` }));
                      onNavigate('/checkout');
                    }}
                    className="flex-1 py-2 bg-black text-white font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
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

      {/* Submitted Inquiry Data Display */}
      {submittedData && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
            <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wide">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span>Inquiry Received & Logged</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-mono">{submittedData.createdAt}</span>
          </div>

          <p className="text-xs text-emerald-900 font-medium">
            Thank you! Your message has been sent to SparkRoot Concierge. Here is the logged inquiry data:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/80 p-4 rounded-xl border border-emerald-200">
            <div>
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Client Name</span>
              <span className="font-extrabold text-slate-900">{submittedData.name}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Email Address</span>
              <span className="font-extrabold text-slate-900">{submittedData.email}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Phone Number</span>
              <span className="font-extrabold text-slate-900">{submittedData.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Address / Subject</span>
              <span className="font-extrabold text-slate-900">{submittedData.address || 'N/A'}</span>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-gray-100">
              <span className="text-gray-400 font-bold block uppercase text-[10px]">Message Details</span>
              <p className="font-medium text-slate-900 mt-0.5 whitespace-pre-wrap">{submittedData.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Support Inquiry Form matching Contact Form process */}
      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase text-slate-900 mb-3">Send Us a Support Message</h3>

        <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 346 7921114"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Address / Subject</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Order #SR-12345 or Delivery Address"
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Message Details *</label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your question, order issue, or feedback..."
              className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-slate-950 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Send size={14} />
            <span>{loading ? 'Sending Message...' : 'Submit Support Inquiry'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
