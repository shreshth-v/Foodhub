import React from 'react';
import { Clock } from 'lucide-react';

export default function PeakHoursChart({ data }) {
  const hours = data?.hours || [];
  const peakHour = data?.peakHour;

  if (hours.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        No peak hours data available.
      </div>
    );
  }

  const maxOrders = Math.max(...hours.map((h) => h.orders || 0), 1);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Peak Ordering Hours (24h IST)
        </h3>
        {peakHour !== undefined && (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Peak Hour: {peakHour}:00 IST
          </span>
        )}
      </div>

      <div className="h-40 flex items-end gap-1 pt-6 pb-2 border-b border-slate-800 overflow-x-auto">
        {hours.map((item) => {
          const isPeak = item.hour === peakHour;
          const heightPercent = Math.max(8, Math.round(((item.orders || 0) / maxOrders) * 100));
          return (
            <div key={item.hour} className="flex-1 min-w-[16px] flex flex-col items-center group relative">
              
              <div className="absolute -top-8 hidden group-hover:flex flex-col items-center z-10 bg-slate-950 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-white whitespace-nowrap">
                <span>{item.hour}:00</span>
                <span className="font-bold text-amber-400">{item.orders} orders</span>
              </div>

              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-sm transition-all ${
                  isPeak
                    ? 'bg-gradient-to-t from-amber-500 to-amber-300'
                    : 'bg-slate-700 group-hover:bg-slate-600'
                }`}
              />

              <span className="text-[9px] text-slate-500 mt-1">
                {item.hour % 4 === 0 ? `${item.hour}h` : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
