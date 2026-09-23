import React from 'react';
import { User, Home, X, LogOut } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function UserMobileDrawer({ isMobileDrawerOpen, setIsMobileDrawerOpen, user, activeTab, setActiveTab, navMenuItems, handleLogout }) {
  if (!isMobileDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileDrawerOpen(false)}
      />

      <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-white p-6 shadow-2xl flex flex-col justify-between animate-category-slide-left overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-slate-950 text-white flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-sm truncate">{user.name}</h4>
                <p className="text-[11px] text-gray-500 font-medium truncate max-w-[130px]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700 transition shrink-0 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5">
            <Link
              to="/"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 hover:bg-[#f4f4f6] hover:text-black transition"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>

            {navMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#f4f4f6] hover:text-black'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setIsMobileDrawerOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
