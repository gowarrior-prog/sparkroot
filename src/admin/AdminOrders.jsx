import { Clock, Trash2 } from 'lucide-react';
import { API } from '../api';

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

  const statusClass = (status) => ({
    'Canceled':  'bg-red-50 text-red-600 border-red-200',
    'confirmed': 'bg-indigo-50 text-indigo-600 border-indigo-200',
    'delivered': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'shipped':   'bg-blue-50 text-blue-600 border-blue-200',
  }[status] || 'bg-slate-100 text-slate-600 border-slate-200');

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold uppercase tracking-widest">Order History</h3>
      <div className="space-y-4">
        {orders.map(o => {
          const parsedItems = typeof o.items === 'string'
            ? (() => { try { return JSON.parse(o.items); } catch { return []; } })()
            : (Array.isArray(o.items) ? o.items : []);

          return (
            <div key={o.id} className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 text-xs font-mono font-bold">#{o.id}</span>
                  <div>
                    <p className="font-bold text-sm text-black">{o.user?.name || 'Guest'}</p>
                    <p className="text-xs text-slate-500 font-medium">{o.email || o.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border flex items-center gap-1 tracking-widest ${statusClass(o.status)}`}>
                    {o.status === 'Canceled' ? <Trash2 size={12} /> : <Clock size={12} />} {o.status}
                  </span>
                  <span className="font-black text-black text-sm">PKR {o.total.toLocaleString()}</span>
                  <span className="text-slate-400 text-xs font-medium">{new Date(o.createdAt).toLocaleDateString()}</span>
                  {o.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(o.id, 'confirmed')}
                      className="ml-2 bg-black hover:bg-slate-800 text-white px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              {(o.address || o.phone) && (
                <div className="px-6 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-6">
                  {o.address && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Address</p>
                      <p className="text-sm font-medium text-black">{o.address}</p>
                    </div>
                  )}
                  {o.phone && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Phone</p>
                      <p className="text-sm font-medium text-black">{o.phone}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Order Items */}
              {parsedItems.length > 0 && (
                <div className="px-6 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Items ({parsedItems.length})</p>
                  <div className="space-y-2">
                    {parsedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-sm px-3 py-2">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-sm object-cover border border-slate-200 flex-shrink-0" onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-black truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity} × PKR {Number(item.price).toLocaleString()}</p>
                        </div>
                        <p className="text-sm font-black text-black flex-shrink-0">PKR {(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-md text-center py-12 text-slate-500 font-medium">No orders placed yet.</div>
        )}
      </div>
    </div>
  );
}
