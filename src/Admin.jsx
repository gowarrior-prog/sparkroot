'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from './lib/routerCompat';
import { API } from './api';
import { RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';
import AdminSidebar    from './admin/AdminSidebar';
import AdminDashboard  from './admin/AdminDashboard';
import AdminProducts   from './admin/AdminProducts';
import AdminOrders     from './admin/AdminOrders';
import AdminReviews    from './admin/AdminReviews';
import AdminUsers      from './admin/AdminUsers';

export default function Admin() {
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats,    setStats]    = useState(null);
  const [products, setProducts] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user    = userStr ? JSON.parse(userStr) : null;

  const handleAuthError = (status) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/signin');
      return true;
    }
    return false;
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const map = {
        dashboard: `${API}/admin/stats`,
        products:  `${API}/admin/products`,
        users:     `${API}/admin/users`,
        orders:    `${API}/admin/orders`,
        reviews:   `${API}/admin/reviews`
      };
      const res = await fetch(map[activeTab], { headers: getAuthHeaders() });
      if (handleAuthError(res.status)) return;
      if (!res.ok) return;
      const data = await res.json();
      if (activeTab === 'dashboard') setStats(data);
      if (activeTab === 'products')  setProducts(data);
      if (activeTab === 'users')     setUsers(data);
      if (activeTab === 'orders')    setOrders(data);
      if (activeTab === 'reviews')   setReviews(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [activeTab]);

  // Skeleton loader
  const Skeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-40 w-full bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Executive Header Bar */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                <span>ATELIER CONTROL PANEL</span>
                <span>/</span>
                <span className="text-black">{activeTab}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-950 uppercase tracking-tight">
                {activeTab} Management
              </h1>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live System Active</span>
              </div>

              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition cursor-pointer disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {/* Main Tab Content */}
          {loading ? <Skeleton /> : (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
              {activeTab === 'dashboard' && <AdminDashboard stats={stats} setActiveTab={setActiveTab} />}
              {activeTab === 'products'  && <AdminProducts  products={products}  onRefresh={fetchData} getAuthHeaders={getAuthHeaders} handleAuthError={handleAuthError} />}
              {activeTab === 'orders'    && <AdminOrders    orders={orders}      onRefresh={fetchData} getAuthHeaders={getAuthHeaders} handleAuthError={handleAuthError} />}
              {activeTab === 'reviews'   && <AdminReviews   reviews={reviews}    onRefresh={fetchData} getAuthHeaders={getAuthHeaders} handleAuthError={handleAuthError} />}
              {activeTab === 'users'     && <AdminUsers     users={users} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
