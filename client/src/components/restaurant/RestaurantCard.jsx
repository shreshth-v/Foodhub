import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Utensils } from 'lucide-react';
import { OpenStatusBadge } from '../common/Badge';

export default function RestaurantCard({ restaurant }) {
  if (!restaurant) return null;

  // Generate a consistent vibrant background tint for the restaurant cover image
  const hash = restaurant.name ? restaurant.name.charCodeAt(0) % 5 : 0;
  const gradients = [
    'from-rose-900/60 to-slate-900',
    'from-amber-900/60 to-slate-900',
    'from-indigo-900/60 to-slate-900',
    'from-emerald-900/60 to-slate-900',
    'from-purple-900/60 to-slate-900',
  ];

  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
    >
      {/* Cover Banner */}
      <div className={`h-40 w-full bg-gradient-to-br ${gradients[hash]} p-4 flex flex-col justify-between relative`}>
        <div className="flex justify-between items-start">
          <span className="px-2.5 py-1 bg-slate-950/70 backdrop-blur-md rounded-lg text-xs font-semibold text-amber-300 flex items-center gap-1 border border-amber-500/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            4.2
          </span>
          <OpenStatusBadge isOpen={restaurant.isOpen !== false} />
        </div>

        <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-rose-500 shadow-lg group-hover:scale-110 transition-transform">
          <Utensils className="w-6 h-6" />
        </div>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{restaurant.area}, {restaurant.city}</span>
          </p>
        </div>

        {/* Cuisines Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
          {restaurant.cuisines?.slice(0, 3).map((cuisine, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
            >
              {cuisine}
            </span>
          ))}
          {restaurant.cuisines?.length > 3 && (
            <span className="px-1.5 py-0.5 rounded text-[11px] font-medium text-slate-400">
              +{restaurant.cuisines.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
