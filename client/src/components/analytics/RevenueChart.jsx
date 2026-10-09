import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function RevenueChart({ data }) {
  const days = data?.days || [];

  if (days.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        No daily revenue records found for selected date range.
      </div>
    );
  }

  const maxRevenue = Math.max(...days.map((d) => d.revenue || 0), 1);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white">Daily Revenue Trend</h3>
        <span className="text-xs text-slate-400 font-semibold">{days.length} days period</span>
      </div>

      <div className="h-48 flex items-end gap-2 pt-6 pb-2 border-b border-slate-800 overflow-x-auto">
        {days.map((item, idx) => {
          const heightPercent = Math.max(10, Math.round(((item.revenue || 0) / maxRevenue) * 100));
          return (
            <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center group relative">
              
              {/* Tooltip */}
              <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-10 bg-slate-950 border border-slate-700 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap shadow-lg">
                <span>{item.date}</span>
                <span className="font-bold text-emerald-400">{formatCurrency(item.revenue || 0)}</span>
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-sm group-hover:from-rose-500 group-hover:to-rose-300 transition-all"
              />
              
              <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                {item.date?.slice(-5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
