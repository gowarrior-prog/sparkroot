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
import AddAddressModal from './components/user/AddAddressModal';
import { useUserOrders } from './components/user/useUserOrders';

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState('account');
  const [orderFilter, setOrderFilter] = useState('all');
  
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
  const { likedProducts, likedProductsData } = useCart();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const { orders, loading } = useUserOrders(token);

  const safeFormatPrice = (val) => {
    if (val === undefined || val === null || val === '') return '0';
    const num = Number(val);
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-PK');
  };

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
        if (Array.isArray(parsedAddr)) setAddresses(parsedAddr);
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

  const wishlistArray = Object.keys(likedProducts || {})
    .filter(id => likedProducts[id])
    .map(id => likedProductsData?.[id] || { id, name: 'Saved Product', price: 0 })
    .filter(Boolean);

  const totalSpentAmount = orders.reduce((sum, o) => sum + (Number(o.price || o.total) || 0), 0);

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
      
      <div className="min-h-screen bg-[#f4f4f6] text-slate-900 pt-6 sm:pt-10 pb-24 sm:pb-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-slate-900 hover:bg-black hover:text-white shadow-2xs transition cursor-pointer"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

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
                />
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs">
                  <h2 className="text-lg font-extrabold uppercase mb-2">My Saved Wishlist</h2>
                  <p className="text-xs text-gray-500 mb-4">You have {wishlistArray.length} items saved.</p>
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    View Complete Wishlist
                  </button>
                </div>
              )}

              {activeTab === 'support' && (
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs space-y-3">
                  <h2 className="text-lg font-extrabold uppercase">SparkRoot Support Concierge</h2>
                  <p className="text-xs text-gray-600">Need help with an order or inquiry?</p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Contact Support Team
                  </button>
                </div>
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