import { Clock, CheckCircle, XCircle, Truck, Package, ChevronDown, ChevronUp, User } from 'lucide-react';

export const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  processing: { label: 'Processing', icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Canceled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-50 text-red-700 border-red-200' },
};

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onDeleteOrder,
  getImageUrl
}) {
  const config = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = config.icon;
  const stepIdx = order.status === 'Canceled' ? -1 : statusSteps.indexOf(order.status);

  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden transition-all hover:border-slate-300">
      {/* Header */}
      <div
        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`p-2 rounded-sm border ${config.color}`}>
            <StatusIcon size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Order #{order.id}
              </span>
              {order.user?.name && (
                <span className="flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-sm">
                  <User size={12} className="text-slate-500" />
                  {order.user.name}
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${config.color}`}>
                {config.label}
              </span>
            </div>
            <p className="text-sm font-bold text-black mt-1">PKR {order.total.toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order.status === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteOrder(order.id);
              }}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition mr-2"
            >
              Delete
            </button>
          )}
          {isExpanded ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-5 bg-slate-50/50 animate-in slide-in-from-top-2 duration-200">
          {/* Progress Tracker */}
          {order.status !== 'Canceled' && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Order Progress</p>
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />
                <div
                  className="absolute top-4 left-0 h-0.5 bg-black transition-all duration-500"
                  style={{ width: `${Math.max(0, (stepIdx / (statusSteps.length - 1)) * 100)}%` }}
                />
                {statusSteps.map((step, i) => {
                  const stepConfig = statusConfig[step];
                  const StepIcon = stepConfig.icon;
                  const isActive = i <= stepIdx;
                  const isCurrent = i === stepIdx;
                  return (
                    <div key={step} className="relative flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-400'
                        } ${isCurrent ? 'ring-4 ring-black/10' : ''}`}
                      >
                        <StepIcon size={14} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-2 ${isActive ? 'text-black' : 'text-slate-400'}`}>
                        {stepConfig.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items List */}
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Items Ordered</p>
          <div className="space-y-2 mb-4">
            {Array.isArray(order.items) &&
              order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 rounded-sm px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={getImageUrl(item.image || item.product?.image)}
                      alt={item.name}
                      className="w-14 h-14 rounded-sm object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150?text=Product';
                      }}
                    />
                    <div>
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-black">PKR {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
          </div>

          {/* Delivery Address */}
          {order.address && (
            <div className="bg-white border border-slate-200 rounded-sm px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Delivery Address</p>
              <p className="text-sm font-medium text-black">{order.address}</p>
              {order.phone && <p className="text-xs text-slate-500 mt-1">Phone: {order.phone}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
