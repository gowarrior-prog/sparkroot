import { DollarSign, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard({ stats }) {
  if (!stats) return null;

  // ─── SVG Revenue Chart ───
  const ChartSection = () => {
    const data = stats.chartData || [];
    if (!data.length) return null;
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
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm mt-6 relative overflow-hidden">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Revenue Trend — Line Chart</h3>
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
                <line x1={padX} y1={y} x2={chartW - padX} y2={y} stroke="#e2e8f0" strokeWidth="1" />
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
                <rect x={p.x - 40} y={p.y - 32} width="80" height="22" rx="4" fill="#000" />
                <text x={p.x} y={p.y - 17} textAnchor="middle" fill="white" style={{ fontSize: '10px', fontWeight: 'bold' }}>
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
    { label: 'Total Revenue',   value: `PKR ${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, hint: '+12% this week' },
    { label: 'Total Orders',    value: stats.totalOrders,    icon: ShoppingBag, hint: '+5% this week' },
    { label: 'Active Users',    value: stats.totalUsers,     icon: Users,       hint: 'Steady growth' },
    { label: 'Products',        value: stats.totalProducts,  icon: Package,     hint: 'Inventory active' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <div key={label} className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition">
              <Icon size={80} />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">{label}</p>
            <h3 className="text-4xl font-black text-black">{value}</h3>
            <p className="text-slate-600 text-xs font-semibold mt-4 flex items-center gap-1">
              <TrendingUp size={14} /> {hint}
            </p>
          </div>
        ))}
      </div>
      <ChartSection />
    </div>
  );
}
