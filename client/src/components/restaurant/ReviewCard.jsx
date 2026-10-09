import React from 'react';
import { Star, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ReviewCard({ review }) {
  if (!review) return null;

  return (
    <div className="glass-panel p-4 rounded-xl space-y-2 border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-white">
              {review.customer?.name || review.customerName || 'Anonymous Customer'}
            </span>
            <p className="text-[11px] text-slate-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Rating stars */}
        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-400 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{review.rating} / 5</span>
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-slate-300 pl-1 border-l-2 border-slate-700 font-normal italic">
          "{review.comment}"
        </p>
      )}
    </div>
  );
}
