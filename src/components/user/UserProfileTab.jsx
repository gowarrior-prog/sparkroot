'use client';

import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Package, Heart, ShieldCheck, Lock, Edit3, Save, X, CheckCircle2 } from 'lucide-react';
import { API } from '../../api';
import { useToast } from '../ToastProvider';

export default function UserProfileTab({ user, ordersCount, wishlistCount, addressesCount, totalSpentAmount, safeFormatPrice, setActiveTab, setUser }) {
  const { addToast } = useToast() || {};
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editName, setEditName] = useState(user.name || '');
  const [editEmail, setEditEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: editName,
          email: user.email,
          newEmail: editEmail !== user.email ? editEmail : undefined,
          password: newPassword.trim().length >= 6 ? newPassword : undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        if (addToast) addToast(data.error || 'Failed to update profile', 'delete');
        setLoading(false);
        return;
      }

      if (data.user) {
        const updated = { ...user, name: data.user.name, email: data.user.email };
        if (setUser) setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
        if (data.token) localStorage.setItem('token', data.token);
      }

      setSuccessMsg('Profile and credentials updated successfully!');
      if (addToast) addToast('Profile details updated!', 'success');
      setNewPassword('');
      setIsEditing(false);
    } catch (err) {
      console.error('Update profile failed:', err);
      if (addToast) addToast('Network error updating profile', 'delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header & Stats */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-950 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-amber-400 shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                  LUXE MEMBER
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-2">
                <span>Member since {user.joined || '2025'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {isEditing ? <X size={15} /> : <Edit3 size={15} />}
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile Credentials'}</span>
          </button>
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

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Edit Form or View Personal Details */}
      {isEditing ? (
        <form onSubmit={handleProfileSave} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Lock size={18} className="text-amber-500" />
            <span>Update Account Credentials & Security</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Full Name / Username</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                New Password <span className="text-gray-400 font-normal">(Leave blank to keep current password)</span>
              </label>
              <input
                type="password"
                placeholder="Enter new password (min. 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-gray-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-black text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <Save size={15} />
              <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-slate-700 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={14} /> Edit
            </button>
          </div>

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
      )}
    </div>
  );
}
