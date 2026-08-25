import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Package } from 'lucide-react';
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
    <div className="hidden lg:flex items-center gap-6 relative">
      <div className="relative">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex items-center bg-slate-100 rounded-full px-4 py-2 transition-all border border-slate-200 ${
            isSearchFocused ? 'w-64 ring-2 ring-black bg-white' : 'w-48 hover:bg-slate-200'
          }`}
        >
          <Search size={18} className="text-slate-500 mr-2 shrink-0 cursor-pointer" onClick={handleSearchSubmit} />
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
            className="bg-transparent border-none outline-none text-black placeholder-slate-400 w-full text-xs font-medium"
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

      <Link to="/my-orders" className="flex flex-col items-center justify-center text-slate-600 hover:text-black transition relative group">
        <Package size={22} />
        <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          Orders
        </span>
      </Link>

      <Link to="/wishlist" className="text-slate-600 hover:text-black transition relative flex flex-col items-center justify-center group">
        <Heart size={22} />
        {likedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
            {likedCount}
          </span>
        )}
        <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          Wishlist
        </span>
      </Link>

      <Link to="/cart" className="relative text-slate-600 hover:text-black transition flex flex-col items-center justify-center group">
        <ShoppingBag size={22} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
            {cartCount}
          </span>
        )}
        <span className="absolute -bottom-4 opacity-0 group-hover:opacity-100 transition text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
          Cart
        </span>
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
                <Link to="/admin" className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-black flex items-center font-bold tracking-widest uppercase">
                  ⚡ Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center font-bold tracking-widest uppercase">
                Log out
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Link to="/signin" className="text-slate-600 hover:text-black font-semibold text-xs tracking-widest uppercase transition">
          Sign In
        </Link>
      )}
    </div>
  );
}
