'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from './lib/routerCompat';
import {
  User,
  Package,
  Heart,
  MapPin,
  Headset,
  LogOut,
  Edit,
  Camera,
  CheckCircle2,
  ChevronRight,
  Plus,
  Trash2,
  Mail,
  Phone,
  Clock,
  RotateCcw,
  Truck,
  ShieldCheck,
  Star,
  ShoppingBag,
  ArrowRight,
  Home,
  Menu,
  X
} from 'lucide-react';
import SEO from './SEO';
import { API } from './api';
import { useToast } from './components/ToastProvider';
import { useCart } from './CartContext';

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('account'); // 'account', 'orders', 'wishlist', 'addresses', 'support'
  const [orderFilter, setOrderFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState({
    name: 'Customer',
    email: 'Not Logged In',
    phone: 'Not Added',
    address: 'Not Added',
    joined: '2025',
    role: 'user'
  });

  const [addresses, setAddresses] = useState([]);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: 'Home', name: '', address: '', phone: '' });

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { likedProducts, likedProductsData, addToCart, toggleLike } = useCart();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Safe price formatter to prevent 'PKR NaN'
  const safeFormatPrice = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    const num = Number(val);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-PK');
  };

  // Load User, Addresses, and Orders
  useEffect(() => {
    try {
      const uStr = localStorage.getItem('user');
      if (uStr) {
        const parsed = JSON.parse(uStr);
        setUser(prev => ({
          ...prev,
          name: parsed.name || 'Customer',
          email: parsed.email || '',
          phone: parsed.phone || 'Not Added',
          address: parsed.address || 'Not Added',
          joined: parsed.joined || '2025',
          role: parsed.role || 'user'
        }));
      }
    } catch (e) {}

    try {
      const savedAddresses = localStorage.getItem('sparkroot_user_addresses');
      if (savedAddresses) {
        const parsedAddr = JSON.parse(savedAddresses);
        if (Array.isArray(parsedAddr)) {
          setAddresses(parsedAddr);
        }
      }
    } catch (e) {}

    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      let serverOrders = [];
      try {
        const res = await fetch(`${API}/my-orders`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) serverOrders = data;
        }
      } catch (err) {}

      let localOrders = [];
      try {
        localOrders = JSON.parse(localStorage.getItem('sparkroot_user_orders') || '[]');
      } catch {}

      const existingIds = new Set(serverOrders.map(o => String(o.id)));
      const combined = [...serverOrders];
      for (const lo of localOrders) {
        if (!existingIds.has(String(lo.id))) {
          combined.push(lo);
        }
      }

      setOrders(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addToast('Logged out successfully', 'success');
    window.location.href = '/';
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.address) return;
    const added = {
      id: Date.now(),
      tag: newAddr.tag,
      name: newAddr.name,
      address: newAddr.address,
      phone: newAddr.phone || user.phone,
      isDefault: addresses.length === 0
    };
    const updated = [...addresses, added];
    setAddresses(updated);
    localStorage.setItem('sparkroot_user_addresses', JSON.stringify(updated));
    setNewAddr({ tag: 'Home', name: '', address: '', phone: '' });
    setShowAddAddressModal(false);
    addToast('New address added and saved', 'success');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('sparkroot_user_addresses', JSON.stringify(updated));
    addToast('Address removed', 'delete');
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status?.toLowerCase() === orderFilter.toLowerCase();
  });

  // Real Wishlist items from CartContext
  const wishlistArray = Object.keys(likedProducts || {})
    .filter(id => likedProducts[id])
    .map(id => likedProductsData?.[id] || { id, name: 'Saved Product', price: 0 })
    .filter(Boolean);

  // Dynamic Total Spent calculation from user orders
  const totalSpentAmount = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

  // Sidebar Menu Tabs
  const navMenuItems = [
    { id: 'account', label: 'My Account', icon: <User size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { id: 'support', label: 'Help & Support', icon: <Headset size={18} /> },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'shipped':
        return 'bg-sky-100 text-sky-700 border-sky-200';
      default:
        return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <>
      <SEO title="User Account Dashboard" description="Manage your profile, orders, addresses, and wishlist." />
      
      {/* Container - Clean top padding since main Navbar is hidden on this page */}
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-6 sm:pt-10 pb-24 sm:pb-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Bar with Home Button & Mobile Menu Trigger */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-black hover:text-white shadow-2xs transition cursor-pointer"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition cursor-pointer"
            >
              <Menu size={16} />
              <span>Account Menu</span>
            </button>
          </div>

          {/* ── MOBILE SIDE DRAWER (SLIDE-IN FROM LEFT ANIMATION) ── */}
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Dark Overlay */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={() => setIsMobileDrawerOpen(false)}
              />

              {/* Drawer Content Panel with slide-left animation */}
              <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white p-6 shadow-2xl flex flex-col justify-between animate-category-slide-left overflow-y-auto">
                <div className="space-y-6">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{user.name}</h4>
                        <p className="text-[11px] text-gray-500 font-medium truncate max-w-[130px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 transition shrink-0 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Drawer Nav Items */}
                  <nav className="space-y-1.5">
                    <Link
                      to="/"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#f4f4f6] hover:text-black transition"
                    >
                      <Home size={18} />
                      <span>Home</span>
                    </Link>

                    {navMenuItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-slate-950 text-white shadow-sm'
                              : 'text-slate-700 hover:bg-[#f4f4f6] hover:text-black'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Drawer Footer Logout */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </aside>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ── 1. LEFT SIDEBAR MENU (Desktop) ── */}
            <aside className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hidden lg:flex flex-col justify-between min-h-[580px]">
              <div className="space-y-6">
                
                {/* User Avatar Summary */}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-900 bg-slate-100 shrink-0 flex items-center justify-center">
                    <User size={28} className="text-slate-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1 truncate">
                      {user.name}
                      <CheckCircle2 size={15} className="text-black fill-black text-white shrink-0" />
                    </h3>
                    <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{user.email}</p>
                  </div>
                </div>

                {/* Nav Links */}
                <nav className="space-y-1">
                  <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#f4f4f6] hover:text-black transition mb-1"
                  >
                    <Home size={18} />
                    <span>Home</span>
                  </Link>
                  {navMenuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'bg-slate-950 text-white shadow-sm'
                            : 'text-slate-700 hover:bg-[#f4f4f6] hover:text-black'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

              </div>

              {/* Logout Button at bottom of sidebar */}
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>

            </aside>

            {/* ── 2. MAIN CONTENT PANEL ── */}
            <main className="lg:col-span-9 space-y-6">

              {/* ──────────────── TAB 1: MY ACCOUNT OVERVIEW ──────────────── */}
              {activeTab === 'account' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Top Dark Banner Card */}
                  <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="flex items-center gap-5 z-10">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white bg-slate-800 shrink-0 flex items-center justify-center">
                        <User size={40} className="text-white" />
                      </div>

                      <div className="space-y-1 text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-2">
                          {user.name}
                          <CheckCircle2 size={18} className="text-white fill-white text-slate-950" />
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-light">{user.email}</p>
                        <p className="text-[11px] text-gray-400">📅 Joined {user.joined}</p>
                      </div>
                    </div>
                  </div>

                  {/* 4 Stat Cards Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div
                      onClick={() => setActiveTab('orders')}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="p-2.5 rounded-xl bg-[#f4f4f6] w-fit mb-3 text-slate-900 group-hover:bg-black group-hover:text-white transition">
                        <Package size={20} />
                      </div>
                      <span className="text-xs text-gray-500 font-semibold block">Total Orders</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-extrabold text-slate-900">{orders.length}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab('wishlist')}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="p-2.5 rounded-xl bg-[#f4f4f6] w-fit mb-3 text-slate-900 group-hover:bg-black group-hover:text-white transition">
                        <Heart size={20} />
                      </div>
                      <span className="text-xs text-gray-500 font-semibold block">Wishlist Items</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-extrabold text-slate-900">{wishlistArray.length}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab('addresses')}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition cursor-pointer group"
                    >
                      <div className="p-2.5 rounded-xl bg-[#f4f4f6] w-fit mb-3 text-slate-900 group-hover:bg-black group-hover:text-white transition">
                        <MapPin size={20} />
                      </div>
                      <span className="text-xs text-gray-500 font-semibold block">Addresses</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xl font-extrabold text-slate-900">{addresses.length}</span>
                        <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs">
                      <div className="p-2.5 rounded-xl bg-[#f4f4f6] w-fit mb-3 text-slate-900">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-xs text-gray-500 font-semibold block">Total Spent</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-lg font-extrabold text-slate-900">PKR {safeFormatPrice(totalSpentAmount)}</span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Personal Information Card (Read-Only) */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                      <div className="space-y-1">
                        <span className="text-gray-400 font-medium block">Full Name</span>
                        <span className="font-semibold text-slate-900 block text-sm">{user.name}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 font-medium block">Email Address</span>
                        <span className="font-semibold text-slate-900 block text-sm">{user.email}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 font-medium block">Phone Number</span>
                        <span className="font-semibold text-slate-900 block text-sm">{user.phone}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-gray-400 font-medium block">Address</span>
                        <span className="font-semibold text-slate-900 block text-sm">{user.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-slate-600 hover:text-black flex items-center gap-1 transition"
                      >
                        <span>View All</span> <ArrowRight size={14} />
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                        <p className="text-xs font-medium">No recent orders placed yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        {orders.slice(0, 3).map((o, idx) => (
                          <div key={o.id || idx} className="bg-[#f4f4f6] border border-gray-200/80 rounded-xl p-3 flex items-center gap-3">
                            <img src={o.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80'} alt={o.name} className="w-12 h-12 rounded-lg object-cover bg-white shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-slate-900 truncate">{o.name || `Order #${o.id}`}</h4>
                              <p className="text-[11px] font-bold text-slate-900">PKR {safeFormatPrice(o.price)}</p>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getStatusBadgeClass(o.status)}`}>
                                {o.status || 'Processing'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ──────────────── TAB 2: MY ORDERS ──────────────── */}
              {activeTab === 'orders' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-fade-in">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">My Orders</h2>
                    
                    <div className="flex items-center gap-1.5 bg-[#f4f4f6] p-1 rounded-xl">
                      {['all', 'processing', 'shipped', 'delivered'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                            orderFilter === st
                              ? 'bg-black text-white shadow-xs'
                              : 'text-gray-600 hover:text-black'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Package size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No orders found.</p>
                      <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((o, idx) => (
                        <div
                          key={o.id || `order-${idx}`}
                          className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition group"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={o.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80'}
                              alt={o.name}
                              className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-gray-200"
                            />
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{o.name || 'Order Item'}</h4>
                              <p className="text-xs text-gray-500 font-medium mt-0.5">Order #{o.id}</p>
                              <span className="text-xs font-bold text-slate-900 block mt-1">PKR {safeFormatPrice(o.price)}</span>
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-gray-200 pt-2 sm:pt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeClass(o.status)}`}>
                              {o.status || 'Processing'}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">{o.date || 'Recent'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* ──────────────── TAB 3: WISHLIST ──────────────── */}
              {activeTab === 'wishlist' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-4">My Wishlist</h2>

                  {wishlistArray.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Heart size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium">Your wishlist is currently empty.</p>
                      <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                        Explore Products
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistArray.map((p, idx) => (
                        <div key={p.id || `wishlist-${idx}`} className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-4 flex flex-col justify-between group">
                          <div className="relative aspect-square rounded-lg bg-white overflow-hidden mb-3 p-2 border border-gray-100">
                            <img
                              src={p.image || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80'}
                              alt={p.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition"
                            />
                            <button
                              onClick={() => toggleLike(p.id, p)}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 hover:scale-110 transition shadow-xs cursor-pointer"
                            >
                              <Heart size={14} className="fill-red-500" />
                            </button>
                          </div>

                          <div className="space-y-1 mb-3">
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.name || 'Product'}</h4>
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                              <Star size={12} className="fill-amber-400" />
                              <span className="text-slate-900 font-bold text-xs">PKR {safeFormatPrice(p.price)}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(p)}
                            className="w-full py-2 bg-black text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                          >
                            <ShoppingBag size={14} /> Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── TAB 4: ADDRESSES ──────────────── */}
              {activeTab === 'addresses' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">My Addresses</h2>
                    <button
                      onClick={() => setShowAddAddressModal(true)}
                      className="px-4 py-2 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                    >
                      <Plus size={14} /> Add New
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm font-medium">No saved addresses yet.</p>
                      <button
                        onClick={() => setShowAddAddressModal(true)}
                        className="inline-block mt-4 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                      >
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-5 space-y-3 relative">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider">
                              {addr.tag}
                            </span>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="space-y-1 text-xs">
                            <h4 className="font-bold text-slate-900 text-sm">{addr.name}</h4>
                            <p className="text-gray-600 font-medium leading-relaxed">{addr.address}</p>
                            <p className="text-gray-500 font-medium pt-1">Phone: {addr.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Address Modal */}
                  {showAddAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                      <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-fade-in-scale">
                        <h3 className="text-base font-bold text-slate-900">Add New Address</h3>
                        <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                          <div>
                            <label className="font-semibold text-gray-600 block mb-1">Tag (Home, Office, etc.)</label>
                            <input
                              type="text"
                              value={newAddr.tag}
                              onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                              className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-gray-600 block mb-1">Full Name</label>
                            <input
                              type="text"
                              value={newAddr.name}
                              onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                              className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-gray-600 block mb-1">Complete Address</label>
                            <textarea
                              value={newAddr.address}
                              onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                              className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-2 px-3 text-xs h-20"
                              required
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-gray-600 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={newAddr.phone}
                              onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                              className="w-full bg-[#f4f4f6] border border-gray-200 rounded-xl py-2 px-3 text-xs"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddAddressModal(false)}
                              className="flex-1 py-2.5 bg-gray-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2.5 bg-black text-white font-bold rounded-xl text-xs cursor-pointer"
                            >
                              Add Address
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ──────────────── TAB 5: HELP & SUPPORT ──────────────── */}
              {activeTab === 'support' && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-fade-in">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-900">Help & Customer Support</h2>
                    <p className="text-xs text-gray-500 mt-1">We are here 24/7 to assist you with your orders and inquiries.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Helpline / WhatsApp */}
                    <div className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-5 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Helpline & WhatsApp Support</h4>
                      <p className="text-xs text-gray-500">Contact our dedicated support concierge anytime.</p>
                      <a href="tel:+923447821114" className="text-sm font-extrabold text-black hover:underline block pt-1">
                        +92 344 7821114
                      </a>
                    </div>

                    {/* Email Support */}
                    <div className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-5 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">Email Assistance</h4>
                      <p className="text-xs text-gray-500">Send us an email and we will respond within 2 hours.</p>
                      <a href="mailto:sparkrootofficial@gmail.com" className="text-xs font-extrabold text-black hover:underline block pt-1">
                        sparkrootofficial@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Important Guidelines & FAQ Box */}
                  <div className="bg-[#f4f4f6] border border-gray-200 rounded-xl p-6 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Clock size={16} className="text-black" />
                      <span>Essential Shipping & Return Guidelines</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Truck size={14} className="text-black" /> Fast Delivery
                        </div>
                        <p className="text-gray-500 text-[11px]">2-4 Business days express delivery across Pakistan.</p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <RotateCcw size={14} className="text-black" /> 7-Day Returns
                        </div>
                        <p className="text-gray-500 text-[11px]">Hassle-free 7 days replacement guarantee on all products.</p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-black" /> Authentic Quality
                        </div>
                        <p className="text-gray-500 text-[11px]">100% genuine luxury products with verified warranty.</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </main>

          </div>

        </div>
      </div>
    </>
  );
}