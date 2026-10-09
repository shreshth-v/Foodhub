import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Utensils } from 'lucide-react';

export default function TopDishesTable({ data }) {
  const dishes = data?.dishes || [];

  if (dishes.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-center text-slate-400">
        No top dishes analytics recorded yet.
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Utensils className="w-4 h-4 text-rose-500" />
        Top Selling Dishes
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase bg-slate-800/80 text-slate-400 border-b border-slate-700/60">
            <tr>
              <th className="py-2.5 px-4 font-semibold">Dish Name</th>
              <th className="py-2.5 px-4 font-semibold text-center">Qty Sold</th>
              <th className="py-2.5 px-4 font-semibold text-right">Revenue Generated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {dishes.map((dish, idx) => (
              <tr key={dish.menuItemId || idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  {dish.name}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-slate-200">
                  {dish.quantitySold?.toLocaleString() || 0}
                </td>
                <td className="py-3 px-4 text-right font-black text-rose-400">
                  {formatCurrency(dish.revenue || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
