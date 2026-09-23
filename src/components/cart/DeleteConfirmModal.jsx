import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({ confirmItem, setConfirmItem, handleConfirmDelete }) {
  if (!confirmItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-slate-100 transform scale-100 transition-all text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={26} strokeWidth={2.2} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1.5 tracking-tight">Remove From Cart?</h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Are you sure you want to delete <strong className="text-slate-800 font-semibold">"{confirmItem.name}"</strong> from your shopping cart?
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setConfirmItem(null)}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase rounded-2xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs tracking-wider uppercase rounded-2xl shadow-lg transition cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
