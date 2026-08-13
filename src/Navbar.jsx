// src/components/Navbar.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Package } from 'lucide-react';
import { useCart } from './CartContext';
import Logo from './Logo';
import { API } from './api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);
  const allProductsCache = useRef([]);
  const navigate = useNavigate();

  // Get both likedCount and cartCount from context
  const { likedCount, cartCount } = useCart();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Preload all products for instant local search
  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { allProductsCache.current = data; })
      .catch(() => {});
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
    e.preventDefault();
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

    // Instant local filter from cache
    const q = val.trim().toLowerCase();
    const localResults = allProductsCache.current
      .filter(p => p.name?.toLowerCase().includes(q))
      .slice(0, 5);
    if (localResults.length > 0) {
      setSuggestions(localResults);
      setShowSuggestions(true);
    }

    // Also do a server call (debounced) to get fresh data
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/products?search=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error(err);
      }
    }, 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <Logo className="h-16 md:h-[72px]" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-10">
              <Link to="/" className="text-slate-800 hover:text-black font-semibold tracking-widest uppercase text-xs transition">Home</Link>
              
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

              <Link to="/about" className="text-slate-800 hover:text-black font-semibold tracking-widest uppercase text-xs transition">About</Link>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-6 relative">
              <div className="relative">
                <form onSubmit={handleSearchSubmit} className={`flex items-center bg-slate-100 rounded-full px-4 py-2 transition-all border border-slate-200 ${isSearchFocused ? 'w-64 ring-2 ring-black bg-white' : 'w-48 hover:bg-slate-200'}`}>
                  <Search size={18} className="text-slate-500 mr-2 shrink-0 cursor-pointer" onClick={handleSearchSubmit} />
                  <input
                    type="text"
                    placeholder="Search SPARKROOT..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => { setIsSearchFocused(true); if(suggestions.length > 0) setShowSuggestions(true); }}
                    onBlur={() => { setIsSearchFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
                    className="bg-transparent border-none outline-none text-black placeholder-slate-400 w-full text-xs font-medium"
                  />
                </form>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-md overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    {suggestions.map(item => (
                      <div 
                        key={item.id}
                        className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                        onMouseDown={(e) => { e.preventDefault(); navigate(`/product/${item.id}`); setShowSuggestions(false); setSearchQuery(''); }}
                      >
                        <img src={getImageUrl(item.image)} alt={item.name} className="w-10 h-10 object-cover rounded-sm border border-slate-200 mr-3" />
                        <div>
                          <p className="text-xs font-bold text-black line-clamp-1">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">PKR {item.price}</p>
                        </div>
                      </div>
                    ))}
                    <div 
                      className="px-4 py-2 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black hover:bg-slate-100 cursor-pointer transition"
                      onMouseDown={(e) => { e.preventDefault(); handleSearchSubmit(e); }}
                    >
                      View all results
                    </div>
                  </div>
                )}
              </div>

              <Link to="/my-orders" className="flex flex-col items-center justify-center text-slate-600 hover:text-black transition relative group">
                <Package size={22} />
                <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Orders</span>
              </Link>

              <Link to="/wishlist" className="text-slate-600 hover:text-black transition relative flex flex-col items-center justify-center group">
                <Heart size={22} />
                {likedCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">{likedCount}</span>}
                <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Wishlist</span>
              </Link>

              <Link to="/cart" className="relative text-slate-600 hover:text-black transition flex flex-col items-center justify-center group">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartCount}
                  </span>
                )}
                <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Cart</span>
              </Link>

              {user ? (
                <div className="relative group">
                  <button className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 transition">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-black truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-black flex items-center font-bold tracking-widest uppercase">⚡ Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center font-bold tracking-widest uppercase">Log out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/signin" className="text-slate-600 hover:text-black font-semibold text-xs tracking-widest uppercase transition">Sign In</Link>
              )}
            </div>

            <button className="lg:hidden text-black p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-xl pb-6">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" onClick={() => setIsOpen(false)} className="block text-slate-800 hover:text-black py-2 font-semibold tracking-widest uppercase text-xs">Home</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block text-slate-800 hover:text-black py-2 font-semibold tracking-widest uppercase text-xs">About</Link>
              
              <div className="py-2 pl-4 border-l-2 border-slate-100 space-y-3">
                <Link to="/category/jewelry" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Jewelry</Link>
                <Link to="/category/cosmetics" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Cosmetics</Link>
                <Link to="/category/fashion" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Fashion</Link>
                <Link to="/category/bags" onClick={() => setIsOpen(false)} className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Bags & Accessories</Link>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="relative mb-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search SPARKROOT..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                      className="w-full bg-slate-100 border border-slate-200 text-black placeholder:text-slate-400 rounded-full pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-black font-medium"
                    />
                    <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Search className="h-4 w-4" />
                    </button>
                  </form>
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden z-50">
                      {suggestions.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-0"
                          onClick={() => { navigate(`/product/${item.id}`); setShowSuggestions(false); setSearchQuery(''); setIsOpen(false); }}
                        >
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-10 h-10 object-cover rounded-sm border border-slate-200 mr-3" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-black truncate">{item.name}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">PKR {item.price}</p>
                          </div>
                        </div>
                      ))}
                      <div
                        className="px-4 py-2.5 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 active:bg-slate-100 cursor-pointer"
                        onClick={(e) => { handleSearchSubmit(e); }}
                      >
                        View all results →
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-around py-4">
                  <Link to="/wishlist" onClick={() => setIsOpen(false)} className="flex flex-col items-center text-slate-600 hover:text-black relative">
                    <Heart className="h-6 w-6 mb-1" />
                    {likedCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {likedCount}
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Wishlist</span>
                  </Link>

                  <Link to="/cart" onClick={() => setIsOpen(false)} className="flex flex-col items-center text-slate-600 hover:text-black relative">
                    <ShoppingBag className="h-6 w-6 mb-1" />
                    <span className="absolute -top-1 right-2 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount || 0}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold mt-1">Cart</span>
                  </Link>
                </div>

                <div className="mt-6 space-y-3">
                  {user ? (
                    <>
                      <div className="text-xs font-semibold text-slate-500 px-2 text-center truncate">{user.email}</div>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block w-full bg-slate-100 border border-slate-200 text-black text-center py-3 rounded-none font-bold tracking-widest uppercase text-xs" onClick={() => setIsOpen(false)}>
                          ⚡ Admin Panel
                        </Link>
                      )}
                      <Link to="/my-orders" className="block w-full bg-slate-50 border border-slate-200 text-black text-center py-3 rounded-none font-bold tracking-widest uppercase text-xs" onClick={() => setIsOpen(false)}>
                        📦 My Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-black text-white py-3 rounded-none font-bold tracking-widest uppercase text-xs hover:bg-slate-800 transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" onClick={() => setIsOpen(false)} className="block w-full bg-slate-100 border border-slate-200 text-center text-black py-3 rounded-none font-bold tracking-widest uppercase text-xs">
                        Sign In
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)} className="block w-full bg-black text-white text-center py-3 rounded-none font-bold tracking-widest uppercase text-xs">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}