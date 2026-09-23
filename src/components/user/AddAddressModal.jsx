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
          <input
            type="text"
            required
            placeholder="Full Name"
            value={newAddr.name}
            onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
            className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
          />
          <input
            type="text"
            required
            placeholder="Street Address, City"
            value={newAddr.address}
            onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
            className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newAddr.phone}
            onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
            className="w-full bg-[#f4f4f6] p-3 rounded-xl border border-gray-200"
          />
          <button type="submit" className="w-full py-3 bg-black text-white font-bold rounded-xl uppercase">
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}
