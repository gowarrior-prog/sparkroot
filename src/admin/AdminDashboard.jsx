'use client';

import { DollarSign, ShoppingBag, Users, Package, TrendingUp, Plus, Eye, MessageSquare, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard({ stats, setActiveTab }) {
  if (!stats) return null;

  // ─── SVG Revenue Chart ───
  const ChartSection = () => {
    const data = stats.chartData || [12000, 24000, 18000, 35000, 29000, 48000, 62000];
    const maxVal = Math.max(...data, 1000);
    const chartW = 700, chartH = 220, padX = 50, padY = 20;
    const innerW = chartW - padX * 2;
    const innerH = chartH - padY * 2;
    const points = data.map((val, i) => ({
      x: padX + (i / (data.length - 1 || 1)) * innerW,
      y: padY + innerH - (val / maxVal) * innerH,
      val
    }));
    const pathD  = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD  = pathD + ` L ${points[points.length - 1].x} ${chartH - padY} L ${points[0].x} ${chartH - padY} Z`;
    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return (
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">Revenue Analytics & Performance</h3>
            <p className="text-xs text-slate-500">Real-time revenue tracking across atelier sales</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
            <TrendingUp size={14} />
            <span>+18.4% Revenue Growth</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#000" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {gridLines.map((pct, i) => {
            const y = padY + innerH - pct * innerH;
            return (
              <g key={i}>
                <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
                <text x={padX - 8} y={y + 4} textAnchor="end" style={{ fontSize: '10px', fill: '#94a3b8', fontWeight: 'bold' }}>
                  {Math.round(maxVal * pct / 1000)}k
                </text>
              </g>
            );
          })}
          {points.map((p, i) => (
            <text key={i} x={p.x} y={chartH - 4} textAnchor="middle" style={{ fontSize: '10px', fill: '#94a3b8', fontWeight: 'bold' }}>P{i + 1}</text>
          ))}
          <path d={areaD} fill="url(#lineGrad)" />
          <path d={pathD} fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i} className="cursor-pointer group">
              <circle cx={p.x} cy={p.y} r="12" fill="transparent" />
              <circle cx={p.x} cy={p.y} r="5"  fill="white" stroke="#000" strokeWidth="2.5" />
              <circle cx={p.x} cy={p.y} r="10" fill="transparent" stroke="#000" strokeWidth="1.5" opacity="0" className="group-hover:opacity-30 transition-opacity" />
              <g className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ pointerEvents: 'none' }}>
                <rect x={p.x - 45} y={p.y - 32} width="90" height="24" rx="6" fill="#000" />
                <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#fbbf24" style={{ fontSize: '10px', fontWeight: 'bold' }}>
                  PKR {p.val.toLocaleString()}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const cards = [
    { label: 'Total Sales Revenue', value: `PKR ${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, hint: '+12% this week', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { label: 'Total Orders',        value: stats.totalOrders || 0,    icon: ShoppingBag, hint: 'Active processing', bg: 'bg-amber-50 border-amber-200 text-amber-800' },
    { label: 'Registered Clients',  value: stats.totalUsers || 0,     icon: Users,       hint: 'Verified client database', bg: 'bg-slate-50 border-slate-200 text-slate-800' },
    { label: 'Active Inventory',    value: stats.totalProducts || 0,  icon: Package,     hint: 'Catalog items live', bg: 'bg-purple-50 border-purple-200 text-purple-800' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Executive Quick Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {setActiveTab && (
          <>
            <button
              onClick={() => setActiveTab('products')}
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} />
              <span>Manage Products</span>
            </button>
            
            <button
              onClick={() => setActiveTab('orders')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
            >
              <Eye size={15} />
              <span>View Customer Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare size={15} />
              <span>Feedback & Reviews</span>
            </button>
          </>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, hint, bg }) => (
          <div key={label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
              <div className={`p-2.5 rounded-xl border ${bg}`}>
                <Icon size={18} />
              </div>
            </div>
            
            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tight mb-2">{value}</h3>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <TrendingUp size={13} className="text-emerald-600" />
              <span>{hint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <ChartSection />
    </div>
  );
}
