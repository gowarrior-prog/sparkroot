import { useState } from 'react';
import { Star, Trash2, MessageSquare } from 'lucide-react';
import { API } from '../api';

export default function AdminReviews({ reviews = [], onRefresh, getAuthHeaders, handleAuthError }) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer review?')) return;
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
        alert('Failed to delete review');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      alert('Error deleting review');
    } finally {
      setDeletingId(null);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Customer Reviews</p>
            <p className="text-3xl font-black text-black">{reviews.length}</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
            <MessageSquare size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Overall Average Rating</p>
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
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Star size={22} className="fill-amber-500" />
          </div>
        </div>
      </div>

      {/* Reviews Table / Cards */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black">
            Customer Feedback & Ratings
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} found
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16 px-4">
            <MessageSquare size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-base font-bold text-slate-700 mb-1">No reviews yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              Jab customers products per reviews submit karein ge to wo sab yahan show hon ge.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-slate-50/50 transition">
                <div className="flex items-start gap-4 flex-1">
                  {/* Product thumbnail */}
                  {rev.product?.image ? (
                    <img
                      src={rev.product.image}
                      alt={rev.product.name}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold flex-shrink-0">
                      Item
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-black">{rev.userName}</h4>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {rev.product?.name && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[200px]">
                            {rev.product.name}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-700 ml-1.5">
                        {rev.rating}.0
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 leading-relaxed font-normal pt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(rev.id)}
                  disabled={deletingId === rev.id}
                  className="self-end sm:self-center text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition border border-transparent hover:border-red-200 cursor-pointer disabled:opacity-50"
                  title="Delete Review"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
