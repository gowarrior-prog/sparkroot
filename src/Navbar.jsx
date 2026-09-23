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
  LayoutGrid
} from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { getCachedProducts } from './productStore';
import NavCategoryDropdown from './components/navbar/NavCategoryDropdown';
import NavMobileMenu from './components/navbar/NavMobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
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
    getCachedProducts().then((data) => { if (Array.isArray(data)) allProductsCache.current = data; });
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsCategoryOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/my-orders' || pathname?.startsWith('/my-orders') || pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
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

            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 sm:mx-6 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search luxury products, watches, jewelry..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#f4f4f6] text-xs py-2.5 pl-4 pr-10 rounded-lg text-slate-900 border border-transparent focus:border-black focus:bg-white transition"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black hover:bg-slate-800 text-white p-1.5 rounded-md transition cursor-pointer"
                >
                  <Search size={14} />
                </button>
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
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-black transition cursor-pointer"
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