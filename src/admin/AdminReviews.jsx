import { useState } from 'react';
import { Star, MessageSquare, Mail, Inbox } from 'lucide-react';
import { API } from '../api';
import ReviewItemCard from './ReviewItemCard';

export default function AdminReviews({ reviews = [], onRefresh, getAuthHeaders, handleAuthError }) {
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState('all');

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">User Contact Messages</p>
            <p className="text-3xl font-black text-black">{contactCount}</p>
          </div>
          <div className="w-12 h-12 bg-sky-50 rounded-full flex items-center justify-center text-sky-600">
            <Mail size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Product Reviews</p>
            <p className="text-3xl font-black text-black">{reviewCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <MessageSquare size={22} />
          </div>
        </div>

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

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Inbox size={18} className="text-slate-700" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-black">
              User Messages & Product Feedback
            </h3>
          </div>

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
            {filteredReviews.map((rev) => (
              <ReviewItemCard
                key={rev.id}
                rev={rev}
                isContact={isContactMsg(rev)}
                handleDelete={handleDelete}
                deletingId={deletingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
