'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Link, useNavigate } from './lib/routerCompat';
import { Menu, X, ChevronDown, Sparkles, Gem, Watch, ShoppingBag, Sparkle } from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { API } from './api';
import { getCachedProducts } from './productStore';
import NavDesktopActions from './components/navbar/NavDesktopActions';
import NavMobileMenu from './components/navbar/NavMobileMenu';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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

  // Hide store Navbar completely on Admin panel!
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath;
    const baseUrl = API.replace(/\/api\/?$/, '');
    return `${baseUrl}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      
      {/* ── Top Announcement Ticker ── */}
      <div className="bg-slate-950 text-amber-300 text-[10px] sm:text-xs py-1.5 px-4 text-center font-bold tracking-[0.18em] uppercase border-b border-white/10 flex items-center justify-center gap-2">
        <Sparkles size={13} className="text-amber-400 animate-pulse shrink-0" />
        <span>Shop with Confidence: 100% Authentic Products & Easy Returns</span>
        <Sparkles size={13} className="text-amber-400 animate-pulse shrink-0 hidden sm:inline" />
      </div>

      {/* ── Main Navbar Container ── */}
      <nav className="w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <Logo className="h-12 sm:h-16 md:h-20 transition-transform group-hover:scale-102 duration-300" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              
              <Link
                to="/"
                className="text-slate-800 hover:text-black font-bold tracking-[0.18em] uppercase text-xs transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                Home
              </Link>

              {/* Category Links */}
              <Link
                to="/category/jewelry"
                className="text-slate-800 hover:text-black font-bold tracking-[0.18em] uppercase text-xs transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                Jewelry
              </Link>

              <Link
                to="/category/fashion"
                className="text-slate-800 hover:text-black font-bold tracking-[0.18em] uppercase text-xs transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                Watches
              </Link>

              <Link
                to="/category/cosmetics"
                className="text-slate-800 hover:text-black font-bold tracking-[0.18em] uppercase text-xs transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                Cosmetics
              </Link>

              <Link
                to="/category/bags"
                className="text-slate-800 hover:text-black font-bold tracking-[0.18em] uppercase text-xs transition relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all"
              >
                Accessories
              </Link>

            </div>

            {/* Desktop Actions (Search, Orders, Wishlist, Cart, Profile) */}
            <NavDesktopActions
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
              handleSearchSubmit={handleSearchSubmit}
              isSearchFocused={isSearchFocused}
              setIsSearchFocused={setIsSearchFocused}
              suggestions={suggestions}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              navigate={navigate}
              getImageUrl={getImageUrl}
              likedCount={likedCount}
              cartCount={cartCount}
              user={user}
              handleLogout={handleLogout}
            />

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        <NavMobileMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestions={suggestions}
          navigate={navigate}
          getImageUrl={getImageUrl}
          likedCount={likedCount}
          cartCount={cartCount}
          user={user}
          handleLogout={handleLogout}
        />
      </nav>
    </header>
  );
}