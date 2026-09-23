import { useState } from 'react';
import { Star, Trash2, MessageSquare, Mail, Phone, MapPin, User, Inbox } from 'lucide-react';
import { API } from '../api';

export default function AdminReviews({ reviews = [], onRefresh, getAuthHeaders, handleAuthError }) {
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'contact', 'reviews'

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (handleAuthError(res.status)) return;
      if (res.ok) {
        onRefresh();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting item');
    } finally {
      setDeletingId(null);
    }
  };

  const isContactMsg = (rev) => {
    return rev.comment && (rev.comment.includes('[CONTACT MESSAGE]') || rev.comment.includes('Phone:'));
  };

  const contactCount = reviews.filter(isContactMsg).length;
  const reviewCount = reviews.length - contactCount;

  const filteredReviews = reviews.filter((rev) => {
    if (filter === 'contact') return isContactMsg(rev);
    if (filter === 'reviews') return !isContactMsg(rev);
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 font-sans">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Contact Form Submissions */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">User Contact Messages</p>
            <p className="text-3xl font-black text-black">{contactCount}</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-600">
            <Mail size={22} />
          </div>
        </div>

        {/* Product Reviews */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Product Reviews</p>
            <p className="text-3xl font-black text-black">{reviewCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <MessageSquare size={22} />
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Overall Store Rating</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-black">{avgRating}</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <Star size={22} className="fill-emerald-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Content Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Inbox size={18} className="text-slate-700" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              User Messages & Product Feedback
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                filter === 'all' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('contact')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                filter === 'contact' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              Contact Messages ({contactCount})
            </button>
            <button
              onClick={() => setFilter('reviews')}
              className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                filter === 'reviews' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              Product Reviews ({reviewCount})
            </button>
          </div>
        </div>

        {/* Empty List State */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700 mb-1">No entries found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              {filter === 'contact'
                ? 'Jab koi user Contact Us form submit kare ga to wo poori detail ke sath yahan admin ko mile ga.'
                : 'Jab customers reviews submit karein ge to wo sab yahan show hon ge.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredReviews.map((rev) => {
              const isContact = isContactMsg(rev);

              return (
                <div key={rev.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/60 transition">
                  <div className="flex items-start gap-4 flex-1">
                    
                    {/* Badge Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                      isContact ? 'bg-sky-100 text-sky-700 border border-sky-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {isContact ? <Mail size={20} /> : <MessageSquare size={20} />}
                    </div>

                    <div className="space-y-2 flex-1 min-w-0">
                      
                      {/* Top Meta Tag */}
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

                      {/* Contact Details Card */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <User size={15} className="text-slate-500 shrink-0" />
                          <span>Name: {rev.userName}</span>
                        </div>

                        {/* Raw Comment or Formatted Contact Fields */}
                        <div className="text-xs text-slate-700 space-y-1 font-mono whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
                          {rev.comment.replace('[CONTACT MESSAGE]', '📩 CONTACT MESSAGE')}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Actions */}
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
            })}
          </div>
        )}
      </div>
    </div>
  );
}
