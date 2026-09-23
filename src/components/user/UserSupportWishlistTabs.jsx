import React from 'react';

export default function UserSupportWishlistTabs({ activeTab, wishlistCount, onNavigate }) {
  if (activeTab === 'wishlist') {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
        <h2 className="text-lg font-extrabold uppercase mb-2">My Saved Wishlist</h2>
        <p className="text-xs text-gray-500 mb-4">You have {wishlistCount} items saved.</p>
        <button
          onClick={() => onNavigate('/wishlist')}
          className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
        >
          View Complete Wishlist
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-3">
      <h2 className="text-lg font-extrabold uppercase">SparkRoot Support Concierge</h2>
      <p className="text-xs text-gray-600">Need help with an order or inquiry?</p>
      <button
        onClick={() => onNavigate('/contact')}
        className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
      >
        Contact Support Team
      </button>
    </div>
  );
}
