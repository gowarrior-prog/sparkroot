import React from 'react';
import { Package, Truck } from 'lucide-react';
import OrderTimerBanner from './OrderTimerBanner';
import { API } from '../../api';
import { restoreProductStock, invalidateProductCache } from '../../productStore';
import { useToast } from '../ToastProvider';

export default function UserOrdersTab({ loading, filteredOrders, orderFilter, setOrderFilter, safeFormatPrice, getStatusBadgeClass, onNavigate }) {
  const { addToast } = useToast() || {};

  const handleAutoConfirm = async (orderId) => {
    try {
      await fetch(`${API}/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' })
      });
    } catch (e) {
      console.warn('Auto confirm sync failed:', e);
    }
  };

  const handleCancelOrder = async (targetOrder) => {
    if (!targetOrder || !targetOrder.id) return;
    const confirmCancel = window.confirm(`Are you sure you want to cancel this order? The product stock will be automatically restored.`);
    if (!confirmCancel) return;

    try {
      // 1. Send PATCH to backend
      await fetch(`${API}/orders/${targetOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      // 2. Restock items locally & invalidate cache
      const itemsToRestore = Array.isArray(targetOrder.items)
        ? targetOrder.items
        : (typeof targetOrder.items === 'string' ? (() => { try { return JSON.parse(targetOrder.items); } catch { return []; } })() : []);
      restoreProductStock(itemsToRestore);
      invalidateProductCache();

      // 3. Update local storage orders
      try {
        const stored = localStorage.getItem('sparkroot_user_orders');
        if (stored) {
          let parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed = parsed.map(o => String(o.id) === String(targetOrder.id) ? { ...o, status: 'cancelled' } : o);
            localStorage.setItem('sparkroot_user_orders', JSON.stringify(parsed));
          }
        }
      } catch {}

      targetOrder.status = 'cancelled';
      if (addToast) addToast('Order cancelled successfully! Item stock restored.', 'success');

      if (typeof window !== 'undefined') {
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      console.error('Cancel order failed:', err);
      if (addToast) addToast('Failed to cancel order', 'delete');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-gray-200">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 uppercase">My Order History</h2>
          <p className="text-xs text-gray-500">Track and view details of your past purchases.</p>
        </div>

        <div className="flex items-center gap-1 bg-[#f4f4f6] p-1 rounded-xl w-full sm:w-auto">
          {['all', 'pending', 'shipped', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setOrderFilter(tab)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                orderFilter === tab ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 p-6 rounded-2xl animate-pulse h-32" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You haven't placed any orders in this status category yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-gray-300 transition space-y-4"
            >
              <OrderTimerBanner order={order} onAutoConfirm={handleAutoConfirm} onCancelOrder={handleCancelOrder} />

              <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 block">
                    Order #SR-{String(order.id).replace(/[^a-zA-Z0-9]/g, '').slice(-7).toUpperCase()}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeClass(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    PKR {safeFormatPrice(order.price || order.total)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {Array.isArray(order.items) ? (
                  order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package size={16} className="m-auto text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name || `Product Item`}</p>
                          <div className="flex items-center gap-2 flex-wrap text-[10px] text-gray-500 font-medium">
                            <span>Qty: {item.quantity || 1}</span>
                            {(item.size || item.selectedSize) && (
                              <span className="bg-slate-950 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                                Size: {item.size || item.selectedSize}
                              </span>
                            )}
                            {(item.color || item.selectedColor) && (
                              <span className="bg-gray-100 text-slate-800 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase border border-gray-200">
                                Color: {item.color || item.selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        PKR {safeFormatPrice((item.price || order.price || order.total) * (item.quantity || 1))}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="font-bold text-slate-900">Order Items Package</span>
                    <span className="font-bold text-slate-900">PKR {safeFormatPrice(order.price || order.total)}</span>
                  </div>
                )}
              </div>

              {(() => {
                let rawAddress = order.address || '';
                let city = order.city || '';
                let postalCode = order.postalCode || '';
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
                  <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-600 flex flex-wrap items-center gap-2 font-medium">
                    <div className="flex items-center gap-1">
                      <Truck size={13} className="text-gray-400 shrink-0" />
                      <span><strong>Address:</strong> {streetAddress || 'Not Provided'}</span>
                    </div>
                    {city && (
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">
                        City: {city}
                      </span>
                    )}
                    {postalCode && (
                      <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold text-[10px]">
                        Port/Zip: {postalCode}
                      </span>
                    )}
                    {order.phone && (
                      <span className="bg-gray-100 text-slate-900 px-2 py-0.5 rounded font-bold text-[10px]">
                        Phone: {order.phone}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
