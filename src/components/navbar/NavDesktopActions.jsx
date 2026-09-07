'use client';

import { Link } from '../../lib/routerCompat';
import { Search, Heart, ShoppingBag, Package, User } from 'lucide-react';
import NavSearchDropdown from './NavSearchDropdown';

export default function NavDesktopActions({
  searchQuery,
  handleSearchChange,
  handleSearchSubmit,
  isSearchFocused,
  setIsSearchFocused,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  navigate,
  getImageUrl,
  likedCount,
  cartCount,
  user,
  handleLogout
}) {
  return (
    <div className="hidden lg:flex items-center gap-5 relative">
      
      {/* Search Input Bar */}
      <div className="relative">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex items-center bg-slate-100/90 rounded-full px-4 py-2 transition-all duration-300 border border-slate-200 ${
            isSearchFocused ? 'w-64 ring-2 ring-black bg-white shadow-md' : 'w-48 hover:bg-slate-200/80 hover:border-slate-300'
          }`}
        >
          <Search size={16} className="text-slate-500 mr-2 shrink-0 cursor-pointer" onClick={handleSearchSubmit} />
          <input
            type="text"
            placeholder="Search SPARKROOT..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              setIsSearchFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onBlur={() => {
              setIsSearchFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="bg-transparent border-none outline-none text-slate-900 placeholder-slate-400 w-full text-xs font-medium"
          />
        </form>

        {showSuggestions && (
          <NavSearchDropdown
            suggestions={suggestions}
            onSelect={(item) => {
              navigate(`/product/${item.id}`);
              setShowSuggestions(false);
            }}
            onViewAll={handleSearchSubmit}
            getImageUrl={getImageUrl}
          />
        )}
      </div>

      {/* Orders Link */}
      <Link
        to="/my-orders"
        className="p-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-full transition relative group"
        title="My Orders"
      >
        <Package size={20} />
      </Link>

      {/* Wishlist Link */}
      <Link
        to="/wishlist"
        className="p-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-full transition relative group"
        title="Wishlist"
      >
        <Heart size={20} />
        {likedCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-xs">
            {likedCount}
          </span>
        )}
      </Link>

      {/* Cart Link */}
      <Link
        to="/cart"
        className="p-2 text-slate-700 hover:text-black hover:bg-slate-100 rounded-full transition relative group"
        title="Shopping Cart"
      >
        <ShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-black text-amber-300 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center shadow-xs">
            {cartCount}
          </span>
        )}
      </Link>

      {/* User Auth Profile Dropdown */}
      {user ? (
        <div className="relative group">
          <button className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-950 text-amber-300 font-bold hover:bg-slate-800 transition cursor-pointer shadow-xs border border-amber-400/30">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </button>
          <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{user.email}</p>
            </div>
            <div className="py-1">
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="px-4 py-2.5 text-xs text-slate-800 hover:bg-slate-100 flex items-center gap-2 font-bold tracking-wider uppercase"
                >
                  ⚡ Admin Panel
                </Link>
              )}
              <Link
                to="/my-orders"
                className="px-4 py-2.5 text-xs text-slate-800 hover:bg-slate-100 flex items-center gap-2 font-bold tracking-wider uppercase"
              >
                📦 My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 font-bold tracking-wider uppercase border-t border-slate-100 cursor-pointer"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link
          to="/signin"
          className="px-5 py-2.5 rounded-full bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-[0.18em] transition shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
        >
          <User size={14} className="text-amber-300" />
          <span>Sign In</span>
        </Link>
      )}
    </div>
  );
}
