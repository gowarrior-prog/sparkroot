'use client';

import React from 'react';
import { Clock, Trash2, AlertTriangle } from 'lucide-react';
import { API } from '../api';
import OrderTimerBanner from '../components/user/OrderTimerBanner';

export default function AdminOrders({ orders, onRefresh, getAuthHeaders, handleAuthError }) {
  const updateStatus = async (id, status) => {
    if (!window.confirm(`Mark order #${id} as ${status}?`)) return;
    const res = await fetch(`${API}/admin/orders/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    handleAuthError(res.status);
    onRefresh();
  };

  const deleteSingleOrder = async (id) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order #${id}?`)) return;
    const res = await fetch(`${API}/admin/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    handleAuthError(res.status);
    try {
      const local = JSON.parse(localStorage.getItem('sparkroot_user_orders') || '[]');
      const updated = local.filter(o => String(o.id) !== String(id));
      localStorage.setItem('sparkroot_user_orders', JSON.stringify(updated));
    } catch {}
    onRefresh();
  };

  const clearAllOrders = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete ALL orders and reset Sales Revenue? This action cannot be undone.')) return;
    const res = await fetch(`${API}/admin/orders`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    handleAuthError(res.status);
    localStorage.removeItem('sparkroot_user_orders');
    localStorage.removeItem('sparkroot_orders');
    onRefresh();
  };

  const statusClass = (status) => ({
    'Canceled':  'bg-red-50 text-red-600 border-red-200',
    'confirmed': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'shipped':   'bg-blue-50 text-blue-600 border-blue-200',
  }[status] || 'bg-slate-100 text-slate-600 border-slate-200');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Order Management & Sales History</h3>
          <p className="text-xs text-slate-500">Manage client orders, status confirmation timers, and sales data.</p>
        </div>
        {orders.length > 0 && (
          <button
            onClick={clearAllOrders}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <AlertTriangle size={15} />
            <span>Reset All Sales & Clear Orders</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {orders.map(o => {
          const parsedItems = typeof o.items === 'string'
            ? (() => { try { return JSON.parse(o.items); } catch { return []; } })()
            : (Array.isArray(o.items) ? o.items : []);

          return (
            <div key={o.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4">
              <OrderTimerBanner order={o} onAutoConfirm={(id) => updateStatus(id, 'confirmed')} />

              {/* Order Header */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 text-xs font-mono font-bold">#{o.id}</span>
                  <div>
                    <p className="font-bold text-sm text-black">{o.name || o.userName || o.user?.name || 'Customer'}</p>
                    <p className="text-xs text-slate-500 font-medium">{o.email || o.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border flex items-center gap-1 tracking-widest ${statusClass(o.status)}`}>
                    {o.status === 'Canceled' ? <Trash2 size={12} /> : <Clock size={12} />} {o.status || 'Pending'}
                  </span>
                  <span className="font-black text-black text-sm">PKR {Number(o.total || o.price || 0).toLocaleString('en-PK')}</span>
                  <span className="text-slate-400 text-xs font-medium">{new Date(o.createdAt || Date.now()).toLocaleDateString('en-PK')}</span>
                  {o.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(o.id, 'confirmed')}
                      className="bg-black hover:bg-slate-800 text-amber-300 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition cursor-pointer"
                    >
                      Confirm Order
                    </button>
                  )}
                  <button
                    onClick={() => deleteSingleOrder(o.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-gray-200 cursor-pointer"
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Delivery Info */}
              {(() => {
                let rawAddress = o.address || '';
                let city = o.city || '';
                let postalCode = o.postalCode || '';
                let streetAddress = rawAddress;

                if (rawAddress.includes('(Port/Zip Code:')) {
                  const parts = rawAddress.split('(Port/Zip Code:');
                  if (parts[1]) postalCode = parts[1].replace(')', '').trim();
                  rawAddress = parts[0].trim();
                }

                if (!city && rawAddress.includes(',')) {
                  const commaIdx = rawAddress.lastIndexOf(',');
                  city = rawAddress.substring(commaIdx + 1).trim();
                  streetAddress = rawAddress.substring(0, commaIdx).trim();
                } else if (rawAddress.includes(',')) {
                  const commaIdx = rawAddress.lastIndexOf(',');
                  streetAddress = rawAddress.substring(0, commaIdx).trim();
                }

                return (
                  <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Customer Name</p>
                      <p className="font-bold text-slate-900">{o.name || o.user?.name || 'Customer'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Street Address</p>
                      <p className="font-bold text-slate-900">{streetAddress || 'Not Provided'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">City</p>
                      <p className="font-bold text-slate-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded w-fit text-[11px]">{city || 'Not Provided'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Port / Zip Code</p>
                      <p className="font-bold text-slate-900 bg-slate-200 text-slate-800 px-2 py-0.5 rounded w-fit text-[11px]">{postalCode || 'Not Provided'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-0.5">Phone Number</p>
                      <p className="font-bold text-slate-900">{o.phone || 'Not Provided'}</p>
                    </div>
                  </div>
                );
              })()}

              {/* Order Items */}
              {parsedItems.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Order Items ({parsedItems.length})</p>
                  <div className="space-y-2">
                    {parsedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-contain border border-slate-200 shrink-0 bg-white" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name || 'Product Item'}</p>
                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500 mt-0.5">
                            <span>Qty: {item.quantity || 1} × PKR {Number(item.price || 0).toLocaleString('en-PK')}</span>
                            {(item.size || item.selectedSize) && (
                              <span className="bg-slate-950 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                                Size: {item.size || item.selectedSize}
                              </span>
                            )}
                            {(item.color || item.selectedColor) && (
                              <span className="bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
                                Color: {item.color || item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs font-extrabold text-slate-900 shrink-0">PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString('en-PK')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl text-center py-12 text-slate-500 font-medium">No orders found.</div>
        )}
      </div>
    </div>
  );
}
