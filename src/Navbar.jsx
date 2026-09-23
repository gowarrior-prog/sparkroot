'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useNavigate } from './lib/routerCompat';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  ChevronDown,
  Headphones,
  Shirt,
  Gem,
  Sparkles,
  Home as HomeIcon,
  Gamepad2,
  LayoutGrid,
  X
} from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { getCachedProducts } from './productStore';
import NavCategoryDropdown from './components/navbar/NavCategoryDropdown';
import NavMobileMenu from './components/navbar/NavMobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const allProductsCache = useRef([]);
  const navigate = useNavigate();

  const { likedCount, cartCount } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (userStr) setUser(JSON.parse(userStr));
    } catch (e) {}
    getCachedProducts().then((data) => { if (Array.isArray(data)) allProductsCache.current = data; });
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsCategoryOpen(false);
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setSearchResults([]);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/my-orders' || pathname?.startsWith('/my-orders') || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchChange = async (val) => {
    setSearchQuery(val);
    const qLower = val.toLowerCase().trim();
    if (!qLower) {
      setSearchResults([]);
      return;
    }
    let cached = allProductsCache.current || [];
    if (cached.length === 0) {
      cached = await getCachedProducts();
      if (Array.isArray(cached)) allProductsCache.current = cached;
    }
    const matches = (cached || []).filter(p =>
      (p.name && p.name.toLowerCase().includes(qLower)) ||
      (p.category && p.category.toLowerCase().includes(qLower)) ||
      (p.description && p.description.toLowerCase().includes(qLower))
    );
    setSearchResults(matches);
  };

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      setSearchResults([]);
      setSearchQuery('');
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const categories = [
    { name: 'Electronics', icon: <Headphones size={18} />, slug: 'electronics' },
    { name: 'Fashion & Apparel', icon: <Shirt size={18} />, slug: 'fashion' },
    { name: 'Jewelry', icon: <Gem size={18} />, slug: 'jewelry' },
    { name: 'Beauty & Cosmetics', icon: <Sparkles size={18} />, slug: 'cosmetics' },
    { name: 'Bags', icon: <ShoppingBag size={18} />, slug: 'bags' },
    { name: "Men's Wear", icon: <User size={18} />, slug: 'mens-wear' },
    { name: "Women's Wear", icon: <Sparkles size={18} />, slug: 'womens-wear' },
    { name: 'Home & Living', icon: <HomeIcon size={18} />, slug: 'home-living' },
    { name: 'Toys & Games', icon: <Gamepad2 size={18} />, slug: 'toys' },
    { name: 'Other', icon: <LayoutGrid size={18} />, slug: 'other' }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-xs font-sans transition-all duration-300">
        <div className="bg-white border-b border-gray-200 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <button
              onClick={() => setIsMobileCategoryOpen(true)}
              className="md:hidden text-slate-900 p-1 hover:text-black transition cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center group shrink-0">
              <Logo variant="dark" />
            </Link>

            {/* Desktop Search Form */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex flex-1 max-w-xl mx-4 sm:mx-6" ref={searchContainerRef}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search luxury products, watches, jewelry..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-[#f4f4f6] text-xs py-2 pl-3 sm:pl-4 pr-8 sm:pr-10 rounded-lg text-slate-900 border border-transparent focus:border-black focus:bg-white transition"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black hover:bg-slate-800 text-white p-1 sm:p-1.5 rounded-md transition cursor-pointer"
                    aria-label="Search"
                  >
                    <Search size={14} />
                  </button>
                )}

                {/* Instant Live Dropdown Results */}
                {searchQuery.trim().length > 0 && pathname !== '/search' && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-96 overflow-y-auto z-50 p-2 text-slate-900 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>Live Search Results ({searchResults.length})</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="text-slate-400 hover:text-black p-0.5 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="py-1 space-y-1">
                        {searchResults.slice(0, 6).map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              const targetId = product.id;
                              setSearchQuery('');
                              setSearchResults([]);
                              navigate(`/product/${targetId}`);
                            }}
                            className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-[#f4f4f6] transition group cursor-pointer"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-black">
                                {product.name}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                {product.category || 'Luxury'}
                              </p>
                            </div>
                            <span className="text-xs font-extrabold text-slate-900 shrink-0">
                              PKR {Number(product.price).toLocaleString('en-PK')}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-xs font-bold text-slate-800">No products found for "{searchQuery}"</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Try searching for a different keyword</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 sm:gap-5">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-extrabold uppercase tracking-wider hover:bg-amber-500 transition shadow-2xs"
                >
                  <Sparkles size={12} /> Admin Panel
                </Link>
              )}

              <Link
                to={user ? (user.role === 'admin' ? '/admin' : '/my-orders') : '/signup'}
                className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-black transition cursor-pointer"
              >
                <User size={18} className="text-slate-700" />
                <span className="hidden lg:inline">{user ? user.name : 'Account'}</span>
              </Link>

              <Link
                to="/wishlist"
                className="relative p-1 text-slate-800 hover:text-black transition cursor-pointer"
              >
                <Heart size={20} />
                {likedCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {likedCount}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-1 text-slate-800 hover:text-black transition cursor-pointer"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Dedicated Mobile Search Bar Row (Visible only on mobile < sm) */}
          <div className="sm:hidden mt-2 pt-2 border-t border-gray-100">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products, watches, jewelry..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-[#f4f4f6] text-xs py-2 pl-9 pr-8 rounded-lg text-slate-900 border border-transparent focus:border-black focus:bg-white transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-2 text-slate-400 hover:text-black p-1 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Mobile Live Dropdown Results */}
              {searchQuery.trim().length > 0 && pathname !== '/search' && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 p-2 text-slate-900 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>Live Search Results ({searchResults.length})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="text-slate-400 hover:text-black p-0.5 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="py-1 space-y-1">
                      {searchResults.slice(0, 5).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            const targetId = product.id;
                            setSearchQuery('');
                            setSearchResults([]);
                            navigate(`/product/${targetId}`);
                          }}
                          className="w-full text-left flex items-center gap-3 p-2 rounded-xl hover:bg-[#f4f4f6] transition group cursor-pointer"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-black">
                              {product.name}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">
                              {product.category || 'Luxury'}
                            </p>
                          </div>
                          <span className="text-xs font-extrabold text-slate-900 shrink-0">
                            PKR {Number(product.price).toLocaleString('en-PK')}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-xs font-bold text-slate-800">No products found</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="bg-black text-white px-4 sm:px-8 py-2 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gray-300 transition cursor-pointer py-1"
              >
                <Menu size={16} />
                <span>All Categories</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              <NavCategoryDropdown
                categories={categories}
                isCategoryOpen={isCategoryOpen}
                setIsCategoryOpen={setIsCategoryOpen}
              />
            </div>

            <nav className="flex items-center gap-6 text-xs font-extrabold uppercase tracking-widest">
              <Link to="/" className="text-white hover:text-amber-300 transition py-1">Home</Link>
              <Link to="/contact" className="text-white hover:text-amber-300 transition py-1">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      <NavMobileMenu
        isMobileCategoryOpen={isMobileCategoryOpen}
        setIsMobileCategoryOpen={setIsMobileCategoryOpen}
        categories={categories}
        user={user}
        navigate={navigate}
      />
    </>
  );
}