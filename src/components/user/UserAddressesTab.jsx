import React from 'react';
import { MapPin, Plus, Trash2, Edit } from 'lucide-react';

export default function UserAddressesTab({ addresses, setShowAddAddressModal, handleDeleteAddress, handleEditAddress }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 uppercase">Saved Addresses</h2>
          <p className="text-xs text-gray-500">Manage delivery locations for quick checkout.</p>
        </div>
        <button
          onClick={() => setShowAddAddressModal(true)}
          className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl">
          <MapPin size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Addresses</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
            You haven't added any shipping addresses yet.
          </p>
          <button
            onClick={() => setShowAddAddressModal(true)}
            className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs relative space-y-2">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase">
                  {addr.tag || 'Home'}
                </span>
                <div className="flex items-center gap-1">
                  {handleEditAddress && (
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="p-1.5 text-gray-400 hover:text-black transition rounded-lg hover:bg-gray-100 cursor-pointer"
                      title="Edit address"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Remove address"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900">{addr.name}</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">{addr.address}</p>
              {(addr.city || addr.postalCode) && (
                <p className="text-[11px] text-gray-500 font-semibold">
                  {addr.city}{addr.city && addr.postalCode ? ` - ` : ''}{addr.postalCode ? `Postal Code: ${addr.postalCode}` : ''}
                </p>
              )}
              {addr.phone && <p className="text-[11px] text-gray-500 font-semibold">Phone: {addr.phone}</p>}
              {addr.email && <p className="text-[11px] text-gray-400 font-medium">Email: {addr.email}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
