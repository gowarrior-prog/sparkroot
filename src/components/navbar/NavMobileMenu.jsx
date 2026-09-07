'use client';

import { Link } from '../../lib/routerCompat';
import { Search, Heart, ShoppingBag, Gem, Watch, Sparkles, Package, User } from 'lucide-react';

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
  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-white border-t border-slate-200 shadow-2xl pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="px-5 py-6 space-y-6">
        
        {/* Search Bar */}
        <div className="relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search SPARKROOT..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              className="w-full bg-slate-100 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-full pl-4 pr-10 py-3 text-xs focus:outline-none focus:border-black font-medium shadow-inner"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50">
              {suggestions.map(item => (
                <div
                  key={item.id}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 active:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-0"
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    setShowSuggestions(false);
                    setIsOpen(false);
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

        {/* Navigation Categories */}
        <div className="space-y-1 pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 px-1 mb-2">Navigation</p>
          
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-slate-900 hover:text-black py-2.5 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-100 transition"
          >
            <span>Home</span>
          </Link>

          <Link
            to="/category/jewelry"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-black py-2.5 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-100 transition"
          >
            <Gem size={15} className="text-amber-600 shrink-0" />
            <span>Fine Jewelry</span>
          </Link>

          <Link
            to="/category/fashion"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-black py-2.5 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-100 transition"
          >
            <Watch size={15} className="text-slate-700 shrink-0" />
            <span>Luxury Watches</span>
          </Link>

          <Link
            to="/category/cosmetics"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-black py-2.5 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-100 transition"
          >
            <Sparkles size={15} className="text-amber-500 shrink-0" />
            <span>Cosmetics & Beauty</span>
          </Link>

          <Link
            to="/category/bags"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 text-slate-700 hover:text-black py-2.5 px-3 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-100 transition"
          >
            <ShoppingBag size={15} className="text-slate-700 shrink-0" />
            <span>Bags & Accessories</span>
          </Link>
        </div>

        {/* Quick Action Badges */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200">
          <Link
            to="/my-orders"
            onClick={() => setIsOpen(false)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-black"
          >
            <Package size={20} className="mb-1 text-slate-600" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Orders</span>
          </Link>

          <Link
            to="/wishlist"
            onClick={() => setIsOpen(false)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-black relative"
          >
            <Heart size={20} className="mb-1 text-slate-600" />
            {likedCount > 0 && (
              <span className="absolute top-2 right-4 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {likedCount}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider font-bold">Wishlist</span>
          </Link>

          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-black relative"
          >
            <ShoppingBag size={20} className="mb-1 text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute top-2 right-4 bg-black text-amber-300 text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider font-bold">Cart</span>
          </Link>
        </div>

        {/* User Auth Buttons */}
        <div className="pt-3">
          {user ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 rounded-full bg-black text-amber-300 text-[10px] font-bold uppercase tracking-wider"
                  >
                    Admin
                  </Link>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-bold tracking-widest uppercase text-xs transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-slate-100 border border-slate-300 text-center text-slate-900 py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-200 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full bg-black text-white text-center py-3.5 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-slate-800 transition shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
