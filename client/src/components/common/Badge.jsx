import React from 'react';

export function VegBadge({ isVeg }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide border ${
        isVeg
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600/50'
          : 'bg-rose-950/80 text-rose-400 border-rose-600/50'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isVeg ? 'bg-emerald-500' : 'bg-rose-500'
        }`}
      />
      {isVeg ? 'VEG' : 'NON-VEG'}
    </span>
  );
}

export function OpenStatusBadge({ isOpen }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isOpen
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-slate-800 text-slate-400 border border-slate-700'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
        }`}
      />
      {isOpen ? 'Open Now' : 'Closed'}
    </span>
  );
}
