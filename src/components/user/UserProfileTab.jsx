import React from 'react';
import { User, Mail, Phone, MapPin, Package, Heart, Clock, ShieldCheck } from 'lucide-react';

export default function UserProfileTab({ user, ordersCount, wishlistCount, addressesCount, totalSpentAmount, safeFormatPrice, setActiveTab }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-amber-400 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                  LUXE MEMBER
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-2">
                <span>Member since {user.joined}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div
            onClick={() => setActiveTab('orders')}
            className="p-4 bg-[#f4f4f6] rounded-2xl cursor-pointer hover:bg-black hover:text-white transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Total Orders</span>
              <Package size={18} className="text-black group-hover:text-amber-300" />
            </div>
            <p className="text-2xl font-black">{ordersCount}</p>
          </div>

          <div
            onClick={() => setActiveTab('wishlist')}
            className="p-4 bg-[#f4f4f6] rounded-2xl cursor-pointer hover:bg-black hover:text-white transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Saved Wishlist</span>
              <Heart size={18} className="text-black group-hover:text-amber-300" />
            </div>
            <p className="text-2xl font-black">{wishlistCount}</p>
          </div>

          <div
            onClick={() => setActiveTab('addresses')}
            className="p-4 bg-[#f4f4f6] rounded-2xl cursor-pointer hover:bg-black hover:text-white transition group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500 group-hover:text-gray-300">Saved Addresses</span>
              <MapPin size={18} className="text-black group-hover:text-amber-300" />
            </div>
            <p className="text-2xl font-black">{addressesCount}</p>
          </div>

          <div className="p-4 bg-[#f4f4f6] rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500">Total Spent</span>
              <ShieldCheck size={18} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              PKR {safeFormatPrice(totalSpentAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3">Personal Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#f4f4f6] rounded-2xl">
            <span className="text-gray-400 font-bold block uppercase text-[10px]">Email Address</span>
            <span className="font-bold text-slate-900">{user.email}</span>
          </div>
          <div className="p-3 bg-[#f4f4f6] rounded-2xl">
            <span className="text-gray-400 font-bold block uppercase text-[10px]">Phone Number</span>
            <span className="font-bold text-slate-900">{user.phone}</span>
          </div>
          <div className="p-3 bg-[#f4f4f6] rounded-2xl sm:col-span-2">
            <span className="text-gray-400 font-bold block uppercase text-[10px]">Primary Delivery Address</span>
            <span className="font-bold text-slate-900">{user.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
