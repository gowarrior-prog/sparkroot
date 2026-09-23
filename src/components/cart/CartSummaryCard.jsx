import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from '../../lib/routerCompat';

export default function CartSummaryCard({ cartCount, subtotal, total }) {
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-24 bg-white border border-slate-200 rounded-sm p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-widest mb-6 pb-4 border-b border-slate-200">Order Summary</h2>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Subtotal ({cartCount} items)</span>
            <span className="text-black font-bold">PKR {subtotal.toLocaleString('en-PK')}</span>
          </div>
          <div className="flex justify-between text-slate-600 font-medium">
            <span>Delivery Charges</span>
            <span className="text-emerald-600 font-bold uppercase">Free</span>
          </div>
          <div className="border-t border-slate-200 pt-4 mt-4">
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span className="text-black">PKR {total.toLocaleString('en-PK')}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-emerald-700 bg-emerald-50 p-2 border border-emerald-200 text-center font-bold uppercase tracking-widest rounded-xs">
            ✓ Free Delivery Applied (No extra charges)
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/checkout"
            className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-slate-800 transition-all duration-300 shadow-sm"
          >
            <Zap size={18} /> Proceed to Checkout
          </Link>

          <Link
            to="/"
            className="w-full block py-4 bg-transparent border-2 border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-sm text-center hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
