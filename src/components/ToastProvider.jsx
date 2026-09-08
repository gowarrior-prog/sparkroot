'use client';

import { createContext, useState, useContext, useCallback } from 'react';
import { Check, Trash2, X, ShoppingBag } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);

    // Auto dismiss after 3s
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    }, 3000);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3400);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 400);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Top Floating White Luxury Notification Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 pointer-events-none w-full max-w-sm px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl shadow-2xl border
              bg-white/95 backdrop-blur-xl border-slate-200/90 text-slate-900
              transition-all duration-300 ease-out w-full
              ${toast.exiting 
                ? 'opacity-0 -translate-y-3 scale-95' 
                : 'opacity-100 translate-y-0 scale-100 animate-slide-down'
              }
            `}
          >
            {/* Icon Badge */}
            <div className={`
              flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-xs
              ${toast.type === 'delete' 
                ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }
            `}>
              {toast.type === 'delete' ? (
                <Trash2 size={17} strokeWidth={2.2} />
              ) : (
                <Check size={18} strokeWidth={2.5} />
              )}
            </div>

            {/* Message Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                {toast.type === 'delete' ? 'Cart Updated' : 'Added To Cart'}
              </p>
              <p className="text-xs font-semibold text-slate-800 truncate leading-snug">
                {toast.message}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => dismissToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-slate-700 transition p-1 rounded-full hover:bg-slate-100 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-20px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
