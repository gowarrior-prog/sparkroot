import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingBag } from 'lucide-react';

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
    <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-xl pb-6">
      <div className="px-4 py-6 space-y-4">
        <Link to="/" onClick={() => setIsOpen(false)} className="block text-slate-800 hover:text-black py-2 font-semibold tracking-widest uppercase text-xs">
          Home
        </Link>
        <Link to="/about" onClick={() => setIsOpen(false)} className="block text-slate-800 hover:text-black py-2 font-semibold tracking-widest uppercase text-xs">
          About
        </Link>

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
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
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
                    onClick={() => {
                      navigate(`/product/${item.id}`);
                      setShowSuggestions(false);
                      setIsOpen(false);
                    }}
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
                  onClick={handleSearchSubmit}
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
  );
}
