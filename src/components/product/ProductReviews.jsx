'use client';

import { useState } from 'react';
import { Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { API } from '../../api';
import WriteReviewModal from './WriteReviewModal';
import ReviewStatsCard from './ReviewStatsCard';

export default function ProductReviews({ productId, reviews = [], onReviewSubmitted }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const productReviewsList = (reviews || []).filter(r => !r.comment || !r.comment.includes('[CONTACT MESSAGE]'));
  const totalReviews = productReviewsList.length;
  const avgRating = totalReviews > 0
    ? (productReviewsList.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
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

      <ReviewStatsCard avgRating={avgRating} totalReviews={totalReviews} reviews={productReviewsList} />

      {productReviewsList.length === 0 ? (
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
          {productReviewsList.map((rev) => (
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

      <WriteReviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        statusMessage={statusMessage}
        handleSubmit={handleSubmit}
        userName={userName}
        setUserName={setUserName}
        comment={comment}
        setComment={setComment}
        rating={rating}
        setRating={setRating}
        hoverRating={hoverRating}
        setHoverRating={setHoverRating}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
