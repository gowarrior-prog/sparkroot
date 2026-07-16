// src/components/Navbar.jsx
'use client';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, ShoppingBag, Menu, X, Shield, ChevronDown, Package } from 'lucide-react';
import { useCart } from './CartContext';  // ← Make sure this path is correct (adjust if needed)

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  // Get both likedCount and cartCount from context
  const { likedCount, cartCount } = useCart();

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl md:text-3xl font-black tracking-widest text-black flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 rounded-sm">S</span>
                SPARKROOT
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-10">
              <Link to="/" className="text-slate-800 hover:text-black font-medium tracking-widest uppercase text-sm transition">Home</Link>
              
              <div className="relative">
                <button 
                  onClick={() => setIsShopOpen(!isShopOpen)}
                  className="hidden md:flex items-center text-slate-800 hover:text-black font-medium tracking-widest uppercase text-sm transition group"
                >
                  Shop
                  <ChevronDown size={16} className="ml-1 opacity-50 group-hover:opacity-100 transition-transform group-hover:rotate-180" />
                </button>

                {isShopOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="py-2 flex flex-col">
                      <Link onClick={() => setIsShopOpen(false)} to="/category/jewelry" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Jewelry</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/cosmetics" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Cosmetics</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/fashion" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Fashion</Link>
                      <Link onClick={() => setIsShopOpen(false)} to="/category/bags" className="px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-black transition uppercase tracking-widest text-xs font-semibold">Bags & Accessories</Link>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/about" className="text-slate-800 hover:text-black font-medium tracking-widest uppercase text-sm transition">About</Link>
            </div>

            {/* Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              <div className={`flex items-center bg-slate-100 rounded-full px-4 py-2 transition-all border border-slate-200 ${isSearchFocused ? 'w-64 ring-2 ring-black bg-white' : 'w-48 hover:bg-slate-200'}`}>
                <Search size={18} className="text-slate-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search SPARKROOT..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-transparent border-none outline-none text-black placeholder-slate-400 w-full text-sm font-medium"
                />
              </div>

              <Link to="/my-orders" className="flex flex-col items-center justify-center text-slate-600 hover:text-black transition relative group">
                <Package size={24} />
                <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Orders</span>
              </Link>

              <Link to="/wishlist" className="text-slate-600 hover:text-black transition relative flex flex-col items-center justify-center group">
                <Heart size={24} />
                {likedCount > 0 && <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{likedCount}</span>}
                <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Wishlist</span>
              </Link>

              <Link to="/cart" className="relative text-slate-600 hover:text-black transition flex flex-col items-center justify-center group">
                <ShoppingBag size={24} />
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
                    {user.name.charAt(0).toUpperCase()}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-black truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-2">
                      {user.role === 'admin' && (
                        <Link to="/admin" className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-black flex items-center font-bold tracking-widest uppercase">⚡ Admin Panel</Link>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center font-bold tracking-widest uppercase">Log out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/signin" className="text-slate-600 hover:text-black font-semibold text-sm tracking-widest uppercase transition">Sign In</Link>
              )}
            </div>

            <button className="lg:hidden text-black p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-xl pb-6">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-slate-800 hover:text-black py-2 font-medium tracking-widest uppercase text-sm">Home</Link>
              <Link to="/about" className="block text-slate-800 hover:text-black py-2 font-medium tracking-widest uppercase text-sm">About</Link>
              
              <div className="py-2 pl-4 border-l-2 border-slate-100 space-y-3">
                <Link to="/category/jewelry" className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Jewelry</Link>
                <Link to="/category/cosmetics" className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Cosmetics</Link>
                <Link to="/category/fashion" className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Fashion</Link>
                <Link to="/category/bags" className="block text-slate-600 hover:text-black text-xs font-semibold uppercase tracking-widest">Bags & Accessories</Link>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search SPARKROOT..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                        setIsOpen(false);
                        setSearchQuery('');
                      }
                    }}
                    className="w-full bg-slate-100 border border-slate-200 text-black placeholder:text-slate-400 rounded-full pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-black"
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                </div>

                <div className="flex justify-around py-4">
                  <Link to="/wishlist" className="flex flex-col items-center text-slate-600 hover:text-black relative">
                    <Heart className="h-6 w-6 mb-1" />
                    {likedCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                        {likedCount}
                      </span>
                    )}
                    <span className="text-xs uppercase tracking-widest font-semibold mt-1">Wishlist</span>
                  </Link>

                  <Link to="/cart" className="flex flex-col items-center text-slate-600 hover:text-black relative">
                    <ShoppingBag className="h-6 w-6 mb-1" />
                    <span className="absolute -top-1 right-2 bg-black text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount || 0}
                    </span>
                    <span className="text-xs uppercase tracking-widest font-semibold mt-1">Cart</span>
                  </Link>
                </div>

                <div className="mt-6 space-y-3">
                  {user ? (
                    <>
                      <div className="text-sm font-semibold text-slate-500 px-2 text-center truncate">{user.email}</div>
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
                        className="w-full bg-black text-white py-3 rounded-none font-bold tracking-widest uppercase text-xs hover:bg-slate-800 transition"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="block w-full bg-slate-100 border border-slate-200 text-center text-black py-3 rounded-none font-bold tracking-widest uppercase text-xs">
                        Sign In
                      </Link>
                      <Link to="/signup" className="block w-full bg-black text-white text-center py-3 rounded-none font-bold tracking-widest uppercase text-xs">
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