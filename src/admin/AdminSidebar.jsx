import { LayoutDashboard, Package, Users, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ id, icon: Icon, label, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-bold uppercase tracking-widest text-xs ${
      activeTab === id
        ? 'bg-black text-white shadow-md'
        : 'text-slate-500 hover:text-black hover:bg-slate-100'
    }`}
  >
    <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-400'} />
    {label}
  </button>
);

export default function AdminSidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <aside className="w-full md:w-64 border-b md:border-r border-slate-200 bg-white flex flex-col relative md:fixed md:h-full z-40 shadow-sm">
      <div className="h-20 flex items-center px-6 border-b border-slate-200">
        <span className="text-2xl font-black tracking-widest flex items-center gap-2 uppercase">
          <span className="bg-black text-white px-2 py-0.5 rounded-sm">S</span>
          SPARK<span className="text-slate-400">Admin</span>
        </span>
      </div>

      <div className="p-4 flex-1 space-y-2 mt-4">
        <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="products"  icon={Package}         label="Products"  activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="orders"    icon={ShoppingBag}     label="Orders"    activeTab={activeTab} setActiveTab={setActiveTab} />
        <NavItem id="users"     icon={Users}           label="Users"     activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="p-4 border-t border-slate-200 space-y-2">
        <button
          onClick={() => navigate('/')}
          className="w-full text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition text-left px-4 py-2"
        >
          ← Return to Store
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition font-bold uppercase tracking-widest text-xs"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
