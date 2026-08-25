'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { API } from './api';
import { getCachedProducts } from './productStore';
import NavDesktopActions from './components/navbar/NavDesktopActions';
import NavMobileMenu from './components/navbar/NavMobileMenu';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allProductsCache = useRef([]);
  const navigate = useNavigate();

  const { likedCount, cartCount } = useCart();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    getCachedProducts().then((data) => {
      if (Array.isArray(data)) allProductsCache.current = data;
    });
  }, []);

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
      <nav className="w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <Logo className="h-16 md:h-[72px]" />
              </Link>
            </div>

            <div className="hidden lg:flex lg:items-center lg:gap-10">
              <Link to="/" className="text-slate-800 hover:text-black font-semibold tracking-widest uppercase text-xs transition">
                Home
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="hidden md:flex items-center text-slate-800 hover:text-black font-semibold tracking-widest uppercase text-xs transition group cursor-pointer"
                >
                  Shop
                  <ChevronDown size={14} className="ml-1 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
                </button>
                {isShopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="py-2 flex flex-col">
                      <Link onClick={() => setIsShopOpen(false)} to="/category/jewelry" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Jewelry</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/cosmetics" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Cosmetics</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/fashion" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Fashion</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/bags" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Bags & Accessories</Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="text-slate-800 hover:text-black font-semibold tracking-widest uppercase text-xs transition">
                About
              </Link>
            </div>

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

            <button className="lg:hidden text-black p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

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