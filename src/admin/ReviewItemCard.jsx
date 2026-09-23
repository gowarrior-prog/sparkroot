import React from 'react';
import { Mail, MessageSquare, User, Trash2 } from 'lucide-react';

export default function ReviewItemCard({ rev, isContact, handleDelete, deletingId }) {
  return (
    <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition">
      <div className="flex items-start gap-4 flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
          isContact ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
        }`}>
          {isContact ? <Mail size={20} /> : <MessageSquare size={20} />}
        </div>

        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
              isContact ? 'bg-sky-600 text-white' : 'bg-slate-800 text-white'
            }`}>
              {isContact ? 'User Contact Form' : 'Product Review'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {new Date(rev.createdAt).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <User size={15} className="text-slate-500 shrink-0" />
              <span>Name: {rev.userName}</span>
            </div>
            <div className="text-xs text-slate-700 space-y-1 font-mono whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
              {rev.comment.replace('[CONTACT MESSAGE]', '📩 CONTACT MESSAGE')}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => handleDelete(rev.id)}
        disabled={deletingId === rev.id}
        className="self-end sm:self-center text-slate-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-lg transition border border-slate-200 hover:border-red-200 cursor-pointer disabled:opacity-50"
        title="Delete Record"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
