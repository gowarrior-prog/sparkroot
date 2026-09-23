import React from 'react';
import { X } from 'lucide-react';

export default function AddAddressModal({ showAddAddressModal, setShowAddAddressModal, handleAddAddress, newAddr, setNewAddr }) {
  if (!showAddAddressModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h3 className="font-extrabold text-sm uppercase">Add Delivery Address</h3>
          <button onClick={() => setShowAddAddressModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Full Name"
              value={newAddr.name || ''}
              onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
              className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="03xx-xxxxxxx"
              value={newAddr.phone || ''}
              onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
              className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="Street address, house number, area"
              value={newAddr.address || ''}
              onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
              className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">City</label>
              <input
                type="text"
                placeholder="City Name"
                value={newAddr.city || ''}
                onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Postal / Port Code</label>
              <input
                type="text"
                placeholder="Port/Zip Code"
                value={newAddr.postalCode || ''}
                onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={newAddr.email || ''}
              onChange={e => setNewAddr({ ...newAddr, email: e.target.value })}
              className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
            />
          </div>
          <button type="submit" className="w-full py-3.5 bg-black text-white font-bold rounded-xl uppercase tracking-wider transition hover:bg-slate-800 cursor-pointer mt-2">
            Save Complete Address
          </button>
        </form>
      </div>
    </div>
  );
}
