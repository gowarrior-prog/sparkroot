import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, ShoppingBag, Plus, Trash2, Edit3, 
  Save, X, TrendingUp, DollarSign, UserCheck, Clock, Shield, Star, LogOut
} from 'lucide-react';
import { API } from './api';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', image: '', category: 'jewelry', stock: '0', description: '', featured: false
  });

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [activeTab]);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch(`${API}/admin/stats`, { headers });
        if (res.ok) setStats(await res.json());
      } else if (activeTab === 'products') {
        const res = await fetch(`${API}/admin/products`, { headers });
        if (res.ok) setProducts(await res.json());
      } else if (activeTab === 'users') {
        const res = await fetch(`${API}/admin/users`, { headers });
        if (res.ok) setUsers(await res.json());
      } else if (activeTab === 'orders') {
        const res = await fetch(`${API}/admin/orders`, { headers });
        if (res.ok) setOrders(await res.json());
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const url = editingProduct ? `${API}/admin/products/${editingProduct.id}` : `${API}/admin/products`;
    const method = editingProduct ? 'PUT' : 'POST';
    
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...productForm,
          price: Number(productForm.price),
          stock: Number(productForm.stock)
        })
      });
      if (res.ok) {
        setShowAddProduct(false);
        setEditingProduct(null);
        setProductForm({ name: '', price: '', image: '', category: 'jewelry', stock: '0', description: '', featured: false });
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`${API}/admin/products/${id}`, { method: 'DELETE', headers });
      if (res.ok) fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setShowAddProduct(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-bold uppercase tracking-widest text-xs ${
        activeTab === id 
          ? 'bg-black text-white shadow-md' 
          : 'text-slate-500 hover:text-black hover:bg-slate-100'
      }`}
    >
      <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-400'} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full z-40 shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-slate-200">
          <span className="text-2xl font-black tracking-widest flex items-center gap-2 uppercase">
            <span className="bg-black text-white px-2 py-0.5 rounded-sm">S</span> SPARK<span className="text-slate-400">Admin</span>
          </span>
        </div>
        
        <div className="p-4 flex-1 space-y-2 mt-4">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="products" icon={Package} label="Products" />
          <NavItem id="orders" icon={ShoppingBag} label="Orders" />
          <NavItem id="users" icon={Users} label="Users" />
        </div>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition font-bold uppercase tracking-widest text-xs"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-black text-black uppercase tracking-tight">{activeTab}</h1>
              <p className="text-slate-500 mt-1 font-medium">Manage your {activeTab} effectively</p>
            </div>
            
            <button onClick={() => navigate('/')} className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-black transition border-b-2 border-transparent hover:border-black pb-1">
              Return to Store
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Dashboard */}
              {activeTab === 'dashboard' && stats && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                        <DollarSign size={80} />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Revenue</p>
                      <h3 className="text-4xl font-black text-black">PKR {(stats.totalRevenue || 0).toLocaleString()}</h3>
                      <p className="text-slate-600 text-xs font-semibold mt-4 flex items-center gap-1"><TrendingUp size={14}/> +12% this week</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                        <ShoppingBag size={80} />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Total Orders</p>
                      <h3 className="text-4xl font-black text-black">{stats.totalOrders}</h3>
                      <p className="text-slate-600 text-xs font-semibold mt-4 flex items-center gap-1"><TrendingUp size={14}/> +5% this week</p>
                    </div>

                    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                        <Users size={80} />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Active Users</p>
                      <h3 className="text-4xl font-black text-black">{stats.totalUsers}</h3>
                      <p className="text-slate-600 text-xs font-semibold mt-4 flex items-center gap-1"><TrendingUp size={14}/> Steady growth</p>
                    </div>

                    <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
                        <Package size={80} />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Products</p>
                      <h3 className="text-4xl font-black text-black">{stats.totalProducts}</h3>
                      <p className="text-slate-600 text-xs font-semibold mt-4 flex items-center gap-1">Inventory active</p>
                    </div>
                  </div>
                  

                  {/* Line Chart (SVG) */}
                  {stats.chartData && (() => {
                    const data = stats.chartData;
                    const maxVal = Math.max(...data, 1000);
                    const chartW = 700;
                    const chartH = 220;
                    const padX = 50;
                    const padY = 20;
                    const innerW = chartW - padX * 2;
                    const innerH = chartH - padY * 2;
                    const points = data.map((val, i) => ({
                      x: padX + (i / (data.length - 1 || 1)) * innerW,
                      y: padY + innerH - (val / maxVal) * innerH,
                      val
                    }));
                    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const areaD = pathD + ` L ${points[points.length - 1].x} ${chartH - padY} L ${points[0].x} ${chartH - padY} Z`;
                    const gridLines = [0, 0.25, 0.5, 0.75, 1];
                    
                    return (
                      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm mt-6 relative overflow-hidden">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Revenue Trend — Line Chart</h3>
                        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64" preserveAspectRatio="xMidYMid meet">
                          <defs>
                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#000" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid lines */}
                          {gridLines.map((pct, i) => {
                            const y = padY + innerH - pct * innerH;
                            return (
                              <g key={i}>
                                <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#e2e8f0" strokeWidth="1" />
                                <text x={padX - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-bold" style={{ fontSize: '10px' }}>
                                  {Math.round(maxVal * pct / 1000)}k
                                </text>
                              </g>
                            );
                          })}

                          {/* X axis labels */}
                          {points.map((p, i) => (
                            <text key={i} x={p.x} y={chartH - 4} textAnchor="middle" className="text-[10px] fill-slate-400 font-bold" style={{ fontSize: '10px' }}>
                              P{i + 1}
                            </text>
                          ))}

                          {/* Area fill */}
                          <path d={areaD} fill="url(#lineGrad)" />

                          {/* Line */}
                          <path d={pathD} fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                          {/* Dots with tooltips */}
                          {points.map((p, i) => (
                            <g key={i} className="cursor-pointer group">
                              {/* Invisible larger hit area */}
                              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
                              {/* Visible dot */}
                              <circle cx={p.x} cy={p.y} r="5" fill="white" stroke="#000" strokeWidth="2.5" className="transition-all duration-200 group-hover:r-7" />
                              {/* Hover ring */}
                              <circle cx={p.x} cy={p.y} r="10" fill="transparent" stroke="#000" strokeWidth="1.5" opacity="0" className="group-hover:opacity-30 transition-opacity" />
                              {/* Tooltip */}
                              <g className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ pointerEvents: 'none' }}>
                                <rect x={p.x - 40} y={p.y - 32} width="80" height="22" rx="4" fill="#000" />
                                <text x={p.x} y={p.y - 17} textAnchor="middle" fill="white" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                                  PKR {p.val.toLocaleString()}
                                </text>
                              </g>
                            </g>
                          ))}
                        </svg>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Product Inventory</h3>
                    <button 
                      onClick={() => { setEditingProduct(null); setShowAddProduct(true); }}
                      className="bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition shadow-sm"
                    >
                      <Plus size={16} /> Add Product
                    </button>
                  </div>

                  {showAddProduct ? (
                    <div className="bg-white p-8 rounded-md border border-slate-200 shadow-sm animate-in zoom-in-95 duration-300">
                      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-black uppercase tracking-widest">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                        <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-black bg-slate-100 p-2 rounded-md transition">
                          <X size={20} />
                        </button>
                      </div>
                      <form onSubmit={handleProductSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Product Name</label>
                            <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Price (PKR)</label>
                            <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Image URL</label>
                            <input required type="url" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Category</label>
                            <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition appearance-none font-medium">
                              <option value="jewelry">Jewelry</option>
                              <option value="cosmetics">Cosmetics</option>
                              <option value="fashion">Fashion</option>
                              <option value="bags">Bags</option>
                              <option value="mobile-accessories">Mobile Accessories</option>
                              <option value="kitchen-accessories">Kitchen Accessories</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Stock Level</label>
                            <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition font-medium" />
                          </div>
                          <div className="flex items-center mt-8 gap-3">
                            <input type="checkbox" id="featured" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} className="w-5 h-5 accent-black rounded cursor-pointer" />
                            <label htmlFor="featured" className="text-xs font-bold uppercase tracking-widest cursor-pointer select-none">Show in Featured Collection</label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                          <textarea rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-3 focus:border-black outline-none transition resize-none font-medium"></textarea>
                        </div>
                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 mt-6">
                          <button type="button" onClick={() => setShowAddProduct(false)} className="px-6 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs hover:bg-slate-100 transition">Cancel</button>
                          <button type="submit" className="bg-black hover:bg-slate-800 text-white px-8 py-2.5 rounded-md font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition shadow-sm">
                            <Save size={16} /> {editingProduct ? 'Update Product' : 'Save Product'}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Product</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Category</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Price</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {products.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-sm object-cover border border-slate-200" />
                                  <div>
                                    <p className="font-bold text-sm text-black">{p.name}</p>
                                    {p.featured && <span className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest flex items-center gap-1 w-max mt-1"><Star size={10} className="fill-slate-500" /> Featured</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-slate-100 rounded-sm text-[10px] font-bold uppercase tracking-widest text-slate-600">{p.category}</span>
                              </td>
                              <td className="px-6 py-4 font-bold text-black text-sm">PKR {p.price.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                {p.stock > 0 ? (
                                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-emerald-200">{p.stock} in stock</span>
                                ) : (
                                  <span className="text-red-700 bg-red-50 px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border border-red-200">Out of stock</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => openEdit(p)} className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-md transition"><Edit3 size={16} /></button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {products.length === 0 && (
                            <tr><td colSpan="5" className="text-center py-12 text-slate-500 font-medium">No products found. Add some to get started!</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest">User Management</h3>
                  <div className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Name</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Email</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Role</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Orders</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 font-bold text-sm text-black flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-black">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              {u.name}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm font-medium">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${
                                u.role === 'admin' ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-black font-bold">{u._count?.orders || 0}</td>
                            <td className="px-6 py-4 text-slate-400 text-xs font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Order History</h3>
                  <div className="space-y-4">
                    {orders.map(o => {
                      const parsedItems = typeof o.items === 'string' ? (() => { try { return JSON.parse(o.items); } catch { return []; } })() : (Array.isArray(o.items) ? o.items : []);
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
                            <div className="flex items-center gap-4">
                              <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase border flex items-center gap-1 w-max tracking-widest ${
                                o.status === 'Canceled' ? 'bg-red-50 text-red-600 border-red-200' :
                                o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                o.status === 'shipped' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                              }`}>
                                {o.status === 'Canceled' ? <Trash2 size={12} /> : <Clock size={12} />} {o.status}
                              </span>
                              <span className="font-black text-black text-sm">PKR {o.total.toLocaleString()}</span>
                              <span className="text-slate-400 text-xs font-medium">{new Date(o.createdAt).toLocaleDateString()}</span>
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
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-sm object-cover border border-slate-200 flex-shrink-0"
                                        onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                      />
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
              )}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
