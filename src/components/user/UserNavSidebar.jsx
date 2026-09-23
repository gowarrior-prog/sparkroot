import React from 'react';
import { User, LogOut } from 'lucide-react';

export default function UserNavSidebar({ user, activeTab, setActiveTab, navMenuItems, handleLogout }) {
  return (
    <div className="hidden lg:block lg:col-span-3">
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs sticky top-8 space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-slate-900 text-sm truncate">{user.name}</h3>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navMenuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-[#f4f4f6] hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </div>
    </div>
  );
}
