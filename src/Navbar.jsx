'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useNavigate } from './lib/routerCompat';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Package,
  Menu,
  X,
  ChevronDown,
  Headphones,
  Shirt,
  Gem,
  Sparkles,
  Home as HomeIcon,
  Gamepad2,
  LayoutGrid,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { getCachedProducts } from './productStore';

export default function Navbar() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);
  const allProductsCache = useRef([]);
  const navigate = useNavigate();

  const { likedCount, cartCount } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userStr) setUser(JSON.parse(userStr));
    } catch (e) {}
  }, []);

  useEffect(() => {
    getCachedProducts().then((data) => {
      if (Array.isArray(data)) allProductsCache.current = data;
    });
  }, []);

  // Hide main Navbar on user dashboard /my-orders page after all hooks have executed
  if (pathname === '/my-orders' || pathname?.startsWith('/my-orders')) {
    return null;
  }

  // Close desktop category dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const q = val.trim().toLowerCase();
    const localResults = allProductsCache.current
      .filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      .slice(0, 5);

    setSuggestions(localResults);
    setShowSuggestions(localResults.length > 0);
  };

  const categoriesList = [
    { name: 'Gadgets', icon: <Headphones size={18} />, slug: 'electronics' },
    { name: 'Fashion', icon: <Shirt size={18} />, slug: 'fashion' },
    { name: 'Jewelry', icon: <Gem size={18} />, slug: 'jewelry' },
    { name: 'Beauty & Cosmetics', icon: <Sparkles size={18} />, slug: 'cosmetics' },
    { name: 'Bags', icon: <ShoppingBag size={18} />, slug: 'bags' },
    { name: "Men's Wear", icon: <User size={18} />, slug: 'mens-wear' },
    { name: "Women's Wear", icon: <Sparkles size={18} />, slug: 'womens-wear' },
    { name: 'Home & Living', icon: <HomeIcon size={18} />, slug: 'home-living' },
    { name: 'Toys & Games', icon: <Gamepad2 size={18} />, slug: 'toys' },
    { name: 'Other', icon: <LayoutGrid size={18} />, slug: 'other' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xs font-sans transition-all duration-300">
        


        {/* ── 2. MAIN HEADER ── */}
        <div className="bg-white border-b border-gray-200 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setIsMobileCategoryOpen(true)}
              className="md:hidden text-slate-900 p-1 hover:text-black transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            {/* Logo Emblem + Text */}
            <Link to="/" className="flex items-center group shrink-0">
              <Logo variant="dark" />
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-2xl mx-4 hidden md:block">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  className="w-full bg-[#f2f2f4] border border-gray-200 border-r-0 rounded-l-md py-2 px-4 text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-black transition-all"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-800 text-white py-2 px-4 rounded-r-md transition-all duration-200 cursor-pointer shrink-0 flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-50 overflow-hidden animate-fade-in-scale">
                  {suggestions.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        navigate(`/product/${p.id}`);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-slate-50 flex items-center gap-3 cursor-pointer border-b border-slate-100 last:border-none transition"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded bg-slate-100" />
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900">{p.name}</h4>
                        <p className="text-[11px] text-slate-500 font-bold">PKR {Number(p.price).toLocaleString('en-PK')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-slate-800 p-1 hover:text-black transition"
              >
                <Search size={22} />
              </button>

              <Link to={user ? (user.role === 'admin' ? '/admin' : '/my-orders') : '/signin'} className="hidden md:flex flex-col items-center group cursor-pointer text-slate-700 hover:text-black transition">
                <User size={22} className="group-hover:scale-110 transition-transform text-slate-800" />
                <span className="text-[11px] font-medium mt-0.5 text-slate-700">{user ? (user.name ? user.name.split(' ')[0] : 'Account') : 'Account'}</span>
              </Link>

              <Link to="/wishlist" className="flex flex-col items-center group cursor-pointer text-slate-700 hover:text-black transition relative">
                <div className="relative">
                  <Heart size={22} className="group-hover:scale-110 transition-transform text-slate-800" />
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {likedCount || 0}
                  </span>
                </div>
                <span className="hidden md:block text-[11px] font-medium mt-0.5 text-slate-700">Wishlist</span>
              </Link>

              <Link to="/cart" className="flex flex-col items-center group cursor-pointer text-slate-700 hover:text-black transition relative">
                <div className="relative">
                  <ShoppingBag size={22} className="group-hover:scale-110 transition-transform text-slate-800" />
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount || 0}
                  </span>
                </div>
                <span className="hidden md:block text-[11px] font-medium mt-0.5 text-slate-700">Cart</span>
              </Link>

            </div>

          </div>
        </div>

        {/* ── 3. NAVIGATION ROW (Desktop) ── */}
        <div className="bg-black text-white px-4 sm:px-8 border-t border-white/10 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="bg-black hover:bg-slate-900 text-white font-medium text-xs sm:text-sm py-2.5 px-4 flex items-center gap-2 transition-all cursor-pointer border-r border-white/10"
              >
                <Menu size={16} />
                <span>All Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Desktop Category Dropdown */}
              {isCategoryOpen && (
                <div className="animate-category-slide-down absolute top-full left-0 w-72 bg-[#f4f4f6] border border-gray-200 shadow-2xl rounded-b-2xl z-50 overflow-hidden p-3 space-y-1">
                  {categoriesList.map((cat, idx) => (
                    <Link
                      key={idx}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-800 hover:bg-white hover:text-black rounded-xl hover:shadow-2xs transition-all duration-200 font-medium group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 group-hover:text-black transition-colors">{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <nav className="flex items-center gap-8 text-xs font-semibold uppercase tracking-wider">
              <Link
                to="/"
                className={`py-2.5 relative transition-colors duration-300 group ${
                  pathname === '/' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Home</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                  pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>

              <Link
                to="/contact"
                className={`py-2.5 relative transition-colors duration-300 group ${
                  pathname === '/contact' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>Contact</span>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                  pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </nav>

            <div className="text-[11px] text-gray-400 font-medium">
              ✨ Free Shipping on Orders PKR 5000+
            </div>

          </div>
        </div>

      </header>

      {/* ── 4. MOBILE SIDEBAR CATEGORY DRAWER ── */}
      {isMobileCategoryOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileCategoryOpen(false)}
          />

          <aside className="animate-category-slide-left fixed inset-y-0 left-0 w-80 bg-[#f4f4f6] text-slate-900 shadow-2xl z-50 p-5 flex flex-col justify-between border-r border-gray-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <Logo variant="dark" />
                <button
                  onClick={() => setIsMobileCategoryOpen(false)}
                  className="p-1 rounded-full text-slate-600 hover:text-black hover:bg-gray-200 transition"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Admin button in mobile sidebar if admin */}
              {user?.role === 'admin' && (
                <div className="pt-3">
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileCategoryOpen(false)}
                    className="w-full py-2.5 px-4 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-2 justify-center shadow-xs"
                  >
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Open Admin Panel</span>
                  </Link>
                </div>
              )}

              <div className="pt-4 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-2">Categories</h3>
                {categoriesList.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${cat.slug}`}
                    onClick={() => setIsMobileCategoryOpen(false)}
                    className="flex items-center justify-between p-3 bg-white rounded-xl text-xs font-medium text-slate-800 shadow-2xs hover:bg-black hover:text-white transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 group-hover:text-white transition-colors">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight size={15} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 text-xs text-gray-500 text-center font-medium">
              &copy; SparkRoot Online Store
            </div>
          </aside>
        </div>
      )}

      {/* ── 5. STICKY MOBILE BOTTOM NAVIGATION BAR ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-2 px-4 flex items-center justify-around text-slate-700 shadow-lg">
        <Link to="/" className="flex flex-col items-center group cursor-pointer text-slate-900">
          <HomeIcon size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium mt-1">Home</span>
        </Link>

        <button
          onClick={() => setIsMobileCategoryOpen(true)}
          className="flex flex-col items-center group cursor-pointer text-slate-600 hover:text-black"
        >
          <LayoutGrid size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium mt-1">Categories</span>
        </button>

        <Link to="/wishlist" className="flex flex-col items-center group cursor-pointer text-slate-600 hover:text-black relative">
          <div className="relative">
            <Heart size={20} className="group-hover:scale-110 transition-transform" />
            {likedCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {likedCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium mt-1">Wishlist</span>
        </Link>

        <Link to={user ? (user.role === 'admin' ? '/admin' : '/my-orders') : '/signin'} className="flex flex-col items-center group cursor-pointer text-slate-600 hover:text-black">
          <User size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-medium mt-1">{user?.role === 'admin' ? 'Admin' : 'Account'}</span>
        </Link>
      </nav>
    </>
  );
}