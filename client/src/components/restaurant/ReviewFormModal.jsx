import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Modal from '../common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { createReview } from '../../features/reviewSlice';
import toast from 'react-hot-toast';

export default function ReviewFormModal({ isOpen, onClose, orderId, onReviewSuccess }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const { submitting } = useSelector((state) => state.reviews);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return;

    try {
      await dispatch(createReview({ orderId, rating, comment })).unwrap();
      toast.success('Review submitted successfully!');
      onClose();
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rate & Review Order">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Rating Stars Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
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
                className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-125"
              >
                <Star
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star ? 'fill-amber-400' : 'text-slate-700'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-bold text-amber-400 ml-2">
              {hoverRating || rating} / 5 Stars
            </span>
          </div>
        </div>

        {/* Comment textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Your Review (Optional)
          </label>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about the food quality, taste, and delivery experience..."
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
          />
        </div>

        {/* Form buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-bold text-white brand-gradient rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-transform active:scale-95"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
