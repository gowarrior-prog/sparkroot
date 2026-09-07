'use client';

import { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, X, Send } from 'lucide-react';
import { API } from '../../api';

export default function ProductReviews({ productId, reviews = [], onReviewSubmitted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert('Please provide your name and review comment.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName.trim(),
          rating,
          comment: comment.trim()
        })
      });

      if (res.ok) {
        setStatusMessage('Thank you! Your review has been published.');
        setUserName('');
        setComment('');
        setRating(5);
        if (onReviewSubmitted) onReviewSubmitted();
        setTimeout(() => {
          setStatusMessage(null);
          setIsModalOpen(false);
        }, 1500);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Error submitting your review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="customer-reviews" className="mt-16 md:mt-24 pt-12 border-t border-slate-200">
      {/* Header & Rating Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 block mb-1">
            Real Customer Opinions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
            Customer Reviews & Ratings
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black hover:bg-slate-800 text-white font-semibold uppercase tracking-[0.15em] text-xs rounded-xl shadow-xs hover:shadow-md transition cursor-pointer self-start md:self-auto"
        >
          <MessageSquare size={16} /> Write a Review
        </button>
      </div>

      {/* Rating Stats Card */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-6 sm:p-8 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="text-center md:text-left md:border-r border-slate-200/80 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="text-5xl font-extrabold text-black tracking-tight">{avgRating}</span>
            <span className="text-slate-400 font-medium text-lg">/ 5.0</span>
          </div>
          <div className="flex items-center justify-center md:justify-start text-amber-400 gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={star <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {totalReviews} verified {totalReviews === 1 ? 'customer review' : 'customer reviews'}
          </p>
        </div>

        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : stars === 5 ? 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-600 font-semibold">{stars} Stars</span>
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <MessageSquare size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-black mb-1">Be the first to review this product!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 font-normal">
            Share your experience with this item and help others in making the perfect choice.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 border-2 border-black text-black hover:bg-black hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
          >
            Leave a Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                      {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black flex items-center gap-1.5">
                        {rev.userName}
                        <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-50" title="Verified Customer" />
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">Verified Customer</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 ml-1.5">{rev.rating}.0</span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-normal">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-black p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 block mb-1">
              Share Your Feedback
            </span>
            <h3 className="text-xl font-extrabold text-black tracking-tight mb-4">
              Write a Product Review
            </h3>

            {statusMessage ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 size={44} className="mx-auto text-emerald-500" />
                <p className="text-sm font-bold text-emerald-700">{statusMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                      >
                        <Star
                          size={26}
                          className={
                            star <= (hoverRating || rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {hoverRating || rating} of 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium focus:border-black focus:bg-white outline-none transition"
                  />
                </div>

                {/* Review comment */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Tell us what you loved about this piece, the quality, fit, and finish..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-sm font-normal focus:border-black focus:bg-white outline-none transition resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-black hover:bg-slate-800 text-white flex items-center gap-2 shadow-xs transition cursor-pointer disabled:opacity-50"
                  >
                    <Send size={14} /> {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
