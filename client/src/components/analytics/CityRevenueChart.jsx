import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { MapPin } from 'lucide-react';

export default function CityRevenueChart({ data }) {
  const cities = data?.cities || [];

  if (cities.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        No platform city revenue data recorded.
      </div>
    );
  }

  const maxRev = Math.max(...cities.map((c) => c.revenue || 0), 1);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <MapPin className="w-4 h-4 text-rose-500" />
        City Revenue Distribution
      </h3>

      <div className="space-y-3">
        {cities.map((c) => {
          const pct = Math.round(((c.revenue || 0) / maxRev) * 100);
          return (
            <div key={c.city} className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">{c.city}</span>
                <span className="text-emerald-400">
                  {formatCurrency(c.revenue)} <span className="text-slate-500 font-normal">({c.orders?.toLocaleString() || 0} orders)</span>
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${pct}%` }}
                  className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
