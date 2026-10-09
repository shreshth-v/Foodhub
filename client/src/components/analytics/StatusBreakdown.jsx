import React from 'react';
import { ORDER_STATUSES } from '../../utils/constants';

export default function StatusBreakdown({ data }) {
  const statuses = data?.statuses || [];
  const total = data?.total || 0;

  if (statuses.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        No status breakdown available.
      </div>
    );
  }

  const getStatusColor = (st) => {
    switch (st) {
      case 'delivered':
        return 'bg-emerald-500';
      case 'cancelled':
        return 'bg-rose-500';
      case 'preparing':
        return 'bg-blue-500';
      default:
        return 'bg-amber-500';
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white">Order Status Breakdown</h3>
        <span className="text-xs text-slate-400 font-semibold">{total.toLocaleString()} total orders</span>
      </div>

      <div className="space-y-3">
        {statuses.map((item) => {
          const statusConfig = ORDER_STATUSES[item.status] || { label: item.status };
          const pct = item.percentage ?? Math.round(((item.count || 0) / (total || 1)) * 100);

          return (
            <div key={item.status} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 capitalize">{statusConfig.label}</span>
                <span className="text-slate-400">
                  <span className="text-white font-bold">{item.count}</span> ({pct}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                  className={`h-full rounded-full ${getStatusColor(item.status)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
