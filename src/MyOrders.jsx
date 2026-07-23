// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, AlertCircle, ChevronDown, ChevronUp, User } from 'lucide-react';
import SEO from './SEO';
import { API } from './api';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  processing: { label: 'Processing', icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Canceled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    fetchOrders();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return 'https://via.placeholder.com/150?text=No+Image';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    const baseUrl = API.replace(/\/api\/?$/, ''); 
    return `${baseUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const canCancel = (order) => {
    if (order.status === 'Canceled' || order.status === 'delivered' || order.status === 'shipped') return false;
    const hoursPassed = (currentTime - new Date(order.createdAt)) / (1000 * 60 * 60);
    return hoursPassed <= 24;
  };

  const getTimeRemaining = (order) => {
    const msPassed = currentTime - new Date(order.createdAt);
    const msLeft = Math.max(0, (24 * 60 * 60 * 1000) - msPassed);
    if (msLeft <= 0) return null;
    
    const h = Math.floor(msLeft / (1000 * 60 * 60));
    const m = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((msLeft % (1000 * 60)) / 1000);
    
    return `${h}h ${m}m ${s}s remaining`;
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      const res = await fetch(`${API}/orders/${orderId}/cancel`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setCancellingId(null);
    }
  };

  const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const getStepIndex = (status) => {
    if (status === 'Canceled') return -1;
    return statusSteps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO title="My Orders" description="View and manage your recent orders from SPARKROOT." />
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Title Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              My <span className="text-slate-400">Orders</span>
            </h1>
            <Link to="/" className="text-slate-500 hover:text-black font-bold uppercase tracking-widest text-xs transition">
              Continue Shopping →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-sm">
              <Package size={80} className="mx-auto mb-6 text-slate-300" />
              <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">No Orders Yet</h2>
              <p className="text-slate-500 mb-8 font-medium">You haven't placed any orders yet. Start shopping!</p>
              <Link to="/" className="inline-flex px-10 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition shadow-sm">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const isExpanded = expandedOrder === order.id;
                const stepIdx = getStepIndex(order.status);
                const timeLeft = getTimeRemaining(order);

                return (
                  <div key={order.id} className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden transition-all hover:border-slate-300">
                    
                    {/* Order Header with User Info Included */}
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`p-2 rounded-sm border ${config.color}`}>
                          <StatusIcon size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Order #{order.id}
                            </span>

                            {/* Customer Name inside Order Header */}
                            {order.user?.name && (
                              <span className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                                <User size={12} className="text-slate-500" />
                                {order.user.name}
                              </span>
                            )}

                            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          
                          <p className="text-sm font-bold text-black mt-1">PKR {order.total.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {canCancel(order) && (
                          <div className="flex flex-col items-end gap-1">
                            {timeLeft && <span className="text-[9px] text-red-500 font-bold tracking-widest uppercase">{timeLeft}</span>}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                              disabled={cancellingId === order.id}
                              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-100 transition disabled:opacity-50"
                            >
                              {cancellingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          </div>
                        )}
                        {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
                        
                        {/* Status Tracker */}
                        {order.status !== 'Canceled' && (
                          <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Order Progress</p>
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200"></div>
                              <div 
                                className="absolute top-4 left-0 h-0.5 bg-black transition-all duration-500"
                                style={{ width: `${Math.max(0, (stepIdx / (statusSteps.length - 1)) * 100)}%` }}
                              ></div>

                              {statusSteps.map((step, i) => {
                                const stepConfig = statusConfig[step];
                                const StepIcon = stepConfig.icon;
                                const isActive = i <= stepIdx;
                                const isCurrent = i === stepIdx;
                                return (
                                  <div key={step} className="relative flex flex-col items-center z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                      isActive ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-400'
                                    } ${isCurrent ? 'ring-4 ring-black/10' : ''}`}>
                                      <StepIcon size={14} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isActive ? 'text-black' : 'text-slate-400'}`}>
                                      {stepConfig.label}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Order Items */}
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Items Ordered</p>
                        <div className="space-y-2 mb-4">
                          {Array.isArray(order.items) && order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 rounded-sm px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={getImageUrl(item.image || item.product?.image)}
                                  alt={item.name}
                                  className="w-14 h-14 rounded-sm object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                                  onError={(e) => { 
                                    e.target.onerror = null; 
                                    e.target.src = 'https://via.placeholder.com/150?text=Product'; 
                                  }}
                                />
                                <div>
                                  <p className="text-sm font-bold text-black">{item.name}</p>
                                  <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="text-sm font-black text-black">PKR {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Info */}
                        {order.address && (
                          <div className="bg-white border border-slate-200 rounded-sm px-4 py-3">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Delivery Address</p>
                            <p className="text-sm font-medium text-black">{order.address}</p>
                            {order.phone && <p className="text-xs text-slate-500 mt-1">Phone: {order.phone}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}