'use client';

import { LayoutDashboard, Package, Users, ShoppingBag, MessageSquare, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from '../lib/routerCompat';

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab, count }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-bold text-xs uppercase tracking-wider cursor-pointer ${
        isActive
          ? 'bg-slate-950 text-white shadow-md'
          : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? 'text-amber-300' : 'text-slate-400'} />
        <span>{label}</span>
      </div>
      {count !== undefined && count !== null && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
          isActive ? 'bg-amber-400 text-black' : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default function AdminSidebar({ activeTab, setActiveTab, stats }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <aside className="w-full md:w-64 border-b md:border-r border-slate-200 bg-white text-slate-900 flex flex-col relative md:fixed md:h-full z-40 shadow-xs">
      
      {/* Admin Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-sm shadow-sm border border-slate-800">
            S
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-wider text-slate-950 block">SPARKROOT</span>
            <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase flex items-center gap-1">
              <Sparkles size={10} /> ATELIER CONTROL
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-4 flex-1 space-y-1.5 mt-2 bg-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 px-3 mb-2">Main Menu</p>
        
        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="products"  icon={Package}         label="Products"  activeTab={activeTab} setActiveTab={setActiveTab} count={stats?.totalProducts} />
        <NavItem id="orders"    icon={ShoppingBag}     label="Orders"    activeTab={activeTab} setActiveTab={setActiveTab} count={stats?.totalOrders} />
        <NavItem id="reviews"   icon={MessageSquare}   label="Reviews"   activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="users"     icon={Users}           label="Users"     activeTab={activeTab} setActiveTab={setActiveTab} count={stats?.totalUsers} />
      </div>

      {/* Footer Return & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-black hover:bg-slate-100 transition cursor-pointer"
        >
          <span>Return to Store</span>
          <ExternalLink size={14} />
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition font-bold uppercase tracking-wider text-xs cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
