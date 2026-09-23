import React from 'react';
import { Star, CheckCircle2, X, Send } from 'lucide-react';

export default function WriteReviewModal({
  isModalOpen,
  setIsModalOpen,
  statusMessage,
  handleSubmit,
  userName,
  setUserName,
  comment,
  setComment,
  rating,
  setRating,
  hoverRating,
  setHoverRating,
  isSubmitting
}) {
  if (!isModalOpen) return null;

  return (
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
  );
}
