'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '../../lib/routerCompat';
import { Search, Heart, ShoppingBag, Gem, Watch, Sparkles, Package, X, ChevronRight, LogOut } from 'lucide-react';

export default function NavMobileMenu({
  isOpen,
  setIsOpen,
  searchQuery,
  handleSearchChange,
  handleSearchSubmit,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  navigate,
  getImageUrl,
  likedCount,
  cartCount,
  user,
  handleLogout
}) {
  // shouldRender keeps the drawer mounted long enough to play the closing
  // animation; isVisible drives the actual translate/opacity transition.
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portal target must only be touched on the client.
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let raf1, raf2, timeout;

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      document.body.style.overflow = '';
      timeout = setTimeout(() => setShouldRender(false), 300);
    }

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen]);

  // Always restore scroll if the component unmounts while open.
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!mounted || !shouldRender) return null;

  const close = () => setIsOpen(false);

  const categories = [
    { to: '/category/jewelry', label: 'Fine Jewelry', icon: Gem, tint: 'text-amber-600' },
    { to: '/category/fashion', label: 'Luxury Watches', icon: Watch, tint: 'text-slate-700' },
    { to: '/category/cosmetics', label: 'Cosmetics & Beauty', icon: Sparkles, tint: 'text-amber-500' },
    { to: '/category/bags', label: 'Bags & Accessories', icon: ShoppingBag, tint: 'text-slate-700' },
  ];

  const drawer = (
    <div className="lg:hidden fixed inset-0 z-[9999]" style={{ height: '100dvh' }}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
      />

      {/* Drawer - always mounted at translate-x-full, animates to translate-x-0 */}
      <aside
        className={`absolute top-0 right-0 w-[86%] max-w-[380px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.35)] flex flex-col transition-transform duration-300 ease-out will-change-transform ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ height: '100dvh' }}
      >

        {/* Header */}
        <div className="relative shrink-0 bg-black px-5 pt-6 pb-8 overflow-hidden">
          <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <span className="text-white font-bold tracking-[0.3em] text-sm">SPARKROOT</span>
            <button
              onClick={close}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-amber-300 transition"
            >
              <X size={16} />
            </button>
          </div>

          {user ? (
            <div className="relative mt-6 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                <p className="text-white/50 text-[11px] truncate">{user.email}</p>
              </div>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="shrink-0 px-3 py-1.5 rounded-full bg-amber-300 text-black text-[10px] font-bold uppercase tracking-wider"
                >
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <div className="relative mt-6 grid grid-cols-2 gap-2.5">
              <Link
                to="/signin"
                onClick={close}
                className="text-center py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={close}
                className="text-center py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-black text-xs font-bold uppercase tracking-wider transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto">

          {/* Search */}
          <div className="relative px-5 pt-5">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search SPARKROOT..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-full pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-black focus:ring-2 focus:ring-amber-200 font-medium shadow-inner transition"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-5 right-5 mt-1 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50">
                {suggestions.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setShowSuggestions(false);
                      close();
                    }}
                  >
                    <img src={getImageUrl(item.image)} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 mr-3" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">PKR {Number(item.price).toLocaleString('en-PK')}</p>
                    </div>
                  </div>
                ))}
                <div
                  className="px-4 py-2.5 bg-slate-50 text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 active:bg-slate-100 cursor-pointer"
                  onClick={handleSearchSubmit}
                >
                  View all results →
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3 px-5 pt-5">
            <Link
              to="/my-orders"
              onClick={close}
              className="flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 transition"
            >
              <Package size={18} className="mb-1 text-slate-600" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Orders</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={close}
              className="relative flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 transition"
            >
              <Heart size={18} className="mb-1 text-slate-600" />
              {likedCount > 0 && (
                <span className="absolute top-1.5 right-2.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {likedCount}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-wider font-bold">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              onClick={close}
              className="relative flex flex-col items-center justify-center py-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 transition"
            >
              <ShoppingBag size={18} className="mb-1 text-slate-600" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-2.5 bg-black text-amber-300 text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-wider font-bold">Cart</span>
            </Link>
          </div>

          {/* Categories */}
          <div className="px-5 pt-6 pb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-2">Shop by category</p>

            <Link
              to="/"
              onClick={close}
              className="group flex items-center justify-between text-slate-900 hover:text-black py-3 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-50 transition"
            >
              <span>Home</span>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition" />
            </Link>

            {categories.map(({ to, label, icon: Icon, tint }) => (
              <Link
                key={to}
                to={to}
                onClick={close}
                className="group flex items-center justify-between text-slate-700 hover:text-black py-3 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-50 transition"
              >
                <span className="flex items-center gap-3">
                  <Icon size={15} className={`${tint} shrink-0`} />
                  <span>{label}</span>
                </span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        {user && (
          <div className="shrink-0 px-5 py-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-bold tracking-widest uppercase text-xs transition cursor-pointer"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </div>
  );

  return createPortal(drawer, document.body);
}