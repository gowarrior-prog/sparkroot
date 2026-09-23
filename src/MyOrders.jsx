'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from './lib/routerCompat';
import { User, Package, Heart, MapPin, Headset, Home, Menu } from 'lucide-react';
import SEO from './SEO';
import { useToast } from './components/ToastProvider';
import { useCart } from './CartContext';
import UserNavSidebar from './components/user/UserNavSidebar';
import UserMobileDrawer from './components/user/UserMobileDrawer';
import UserProfileTab from './components/user/UserProfileTab';
import UserOrdersTab from './components/user/UserOrdersTab';
import UserAddressesTab from './components/user/UserAddressesTab';
import UserSupportWishlistTabs from './components/user/UserSupportWishlistTabs';
import AddAddressModal from './components/user/AddAddressModal';
import { useUserOrders } from './components/user/useUserOrders';

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('account');
  const [orderFilter, setOrderFilter] = useState('all');
  
  const [user, setUser] = useState({ name: 'Customer', email: 'Not Logged In', phone: 'Not Added', address: 'Not Added', joined: '2025', role: 'user' });
  const [addresses, setAddresses] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ tag: 'Home', name: '', phone: '', address: '', city: '', postalCode: '', email: '' });

  const navigate = useNavigate();
  const { addToast } = useToast();
  const { likedProducts, likedProductsData } = useCart();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const { orders, loading } = useUserOrders(token);

  const safeFormatPrice = (val) => (val === undefined || val === null || val === '') ? '0' : (isNaN(Number(val)) ? '0' : Number(val).toLocaleString('en-PK'));

  useEffect(() => {
    try {
      const uStr = localStorage.getItem('user');
      if (uStr) {
        const p = JSON.parse(uStr);
        setUser(prev => ({ ...prev, name: p.name || 'Customer', email: p.email || '', phone: (p.phone && p.phone !== '03467921114' && p.phone !== 'Not Added') ? p.phone : 'Not Added', address: p.address || 'Not Added', joined: p.joined || '2025', role: p.role || 'user' }));
      }
      const savedAddresses = localStorage.getItem('sparkroot_user_addresses');
      if (savedAddresses) {
        const parsedAddr = JSON.parse(savedAddresses);
        if (Array.isArray(parsedAddr) && parsedAddr.length > 0) {
          setAddresses(parsedAddr);
          setUser(prev => ({ ...prev, address: parsedAddr[0].address || prev.address, phone: (parsedAddr[0].phone && parsedAddr[0].phone !== '03467921114') ? parsedAddr[0].phone : prev.phone }));
        }
      }
    } catch (e) {}
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addToast('Logged out successfully', 'success');
    window.location.href = '/';
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.address) return;
    const entry = {
      id: newAddr.id || Date.now(),
      tag: newAddr.tag || 'Home',
      name: newAddr.name,
      phone: newAddr.phone || '',
      address: newAddr.address,
      city: newAddr.city || '',
      postalCode: newAddr.postalCode || '',
      email: newAddr.email || '',
      isDefault: addresses.length === 0
    };
    const updated = newAddr.id
      ? addresses.map(a => a.id === newAddr.id ? { ...a, ...entry } : a)
      : [...addresses, entry];
    addToast(newAddr.id ? 'Address updated successfully' : 'New address added and saved', 'success');
    setAddresses(updated);
    localStorage.setItem('sparkroot_user_addresses', JSON.stringify(updated));
    if (updated.length > 0) {
      setUser(prev => ({
        ...prev,
        name: updated[0].name || prev.name,
        address: updated[0].address || prev.address,
        phone: updated[0].phone || prev.phone,
        email: updated[0].email || prev.email
      }));
    }
    setNewAddr({ tag: 'Home', name: '', phone: '', address: '', city: '', postalCode: '', email: '' });
    setShowAddAddressModal(false);
  };

  const handleEditAddress = (addr) => { setNewAddr(addr); setShowAddAddressModal(true); };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem('sparkroot_user_addresses', JSON.stringify(updated));
    if (updated.length > 0) {
      setUser(prev => ({ ...prev, address: updated[0].address, phone: updated[0].phone || prev.phone }));
    } else {
      setUser(prev => ({ ...prev, address: 'Not Added', phone: 'Not Added' }));
    }
    addToast('Address removed', 'delete');
  };

  const filteredOrders = orders.filter(o => orderFilter === 'all' || o.status?.toLowerCase() === orderFilter.toLowerCase());
  const wishlistArray = Object.keys(likedProducts || {}).filter(id => likedProducts[id]).map(id => likedProductsData?.[id] || { id, name: 'Saved Product', price: 0 }).filter(Boolean);
  const totalSpentAmount = orders.reduce((sum, o) => sum + (Number(o.price || o.total) || 0), 0);

  const navMenuItems = [
    { id: 'account', label: 'My Account', icon: <User size={18} /> },
    { id: 'orders', label: 'My Orders', icon: <Package size={18} />, count: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, count: wishlistArray.length },
    { id: 'addresses', label: 'Addresses', icon: <MapPin size={18} />, count: addresses.length },
    { id: 'support', label: 'Help & Support', icon: <Headset size={18} /> }
  ];

  const getStatusBadgeClass = (status) => {
    if (status?.toLowerCase() === 'delivered') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status?.toLowerCase() === 'shipped') return 'bg-sky-100 text-sky-700 border-sky-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <>
      <SEO title="User Account Dashboard" description="Manage your profile, orders, addresses, and wishlist." />
      
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-6 sm:pt-10 pb-24 sm:pb-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-black hover:text-white shadow-2xs transition cursor-pointer"
              >
                <Home size={16} />
                <span>Back to Home</span>
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-black rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-sm transition cursor-pointer"
                >
                  ⚡ Admin Panel
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold shadow-md hover:bg-slate-800 transition cursor-pointer"
            >
              <Menu size={16} />
              <span>Account Menu</span>
            </button>
          </div>

          <UserMobileDrawer
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            navMenuItems={navMenuItems}
            handleLogout={handleLogout}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <UserNavSidebar
              user={user}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navMenuItems={navMenuItems}
              handleLogout={handleLogout}
            />

            <main className="lg:col-span-9">
              {activeTab === 'account' && (
                <UserProfileTab
                  user={user}
                  ordersCount={orders.length}
                  wishlistCount={wishlistArray.length}
                  addressesCount={addresses.length}
                  totalSpentAmount={totalSpentAmount}
                  safeFormatPrice={safeFormatPrice}
                  setActiveTab={setActiveTab}
                  setUser={setUser}
                />
              )}

              {activeTab === 'orders' && (
                <UserOrdersTab
                  loading={loading}
                  filteredOrders={filteredOrders}
                  orderFilter={orderFilter}
                  setOrderFilter={setOrderFilter}
                  safeFormatPrice={safeFormatPrice}
                  getStatusBadgeClass={getStatusBadgeClass}
                  onNavigate={navigate}
                />
              )}

              {activeTab === 'addresses' && (
                <UserAddressesTab
                  addresses={addresses}
                  setShowAddAddressModal={setShowAddAddressModal}
                  handleDeleteAddress={handleDeleteAddress}
                  handleEditAddress={handleEditAddress}
                />
              )}

              {(activeTab === 'wishlist' || activeTab === 'support') && (
                <UserSupportWishlistTabs
                  activeTab={activeTab}
                  user={user}
                  wishlistCount={wishlistArray.length}
                  onNavigate={navigate}
                />
              )}
            </main>
          </div>

        </div>
      </div>

      <AddAddressModal
        showAddAddressModal={showAddAddressModal}
        setShowAddAddressModal={setShowAddAddressModal}
        handleAddAddress={handleAddAddress}
        newAddr={newAddr}
        setNewAddr={setNewAddr}
      />
    </>
  );
}