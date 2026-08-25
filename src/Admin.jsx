import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from './api';
import AdminSidebar    from './admin/AdminSidebar';
import AdminDashboard  from './admin/AdminDashboard';
import AdminProducts   from './admin/AdminProducts';
import AdminOrders     from './admin/AdminOrders';
import AdminUsers      from './admin/AdminUsers';

export default function Admin() {
  const navigate    = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats,    setStats]    = useState(null);
  const [products, setProducts] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  const userStr = localStorage.getItem('user');
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
        orders:    `${API}/admin/orders`
      };
      const res = await fetch(map[activeTab], { headers: getAuthHeaders() });
      if (handleAuthError(res.status)) return;
      if (!res.ok) return;
      const data = await res.json();
      if (activeTab === 'dashboard') setStats(data);
      if (activeTab === 'products')  setProducts(data);
      if (activeTab === 'users')     setUsers(data);
      if (activeTab === 'orders')    setOrders(data);
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
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-40 w-full bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight">{activeTab}</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage your {activeTab} effectively</p>
            </div>
          </div>

          {loading ? <Skeleton /> : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'dashboard' && <AdminDashboard stats={stats} />}
              {activeTab === 'products'  && <AdminProducts  products={products}  onRefresh={fetchData} getAuthHeaders={getAuthHeaders} handleAuthError={handleAuthError} />}
              {activeTab === 'orders'    && <AdminOrders    orders={orders}      onRefresh={fetchData} getAuthHeaders={getAuthHeaders} handleAuthError={handleAuthError} />}
              {activeTab === 'users'     && <AdminUsers     users={users} />}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
