import React from 'react';
import { DollarSign, ShoppingBag, TrendingUp, Star, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function AnalyticsSummaryCards({ revenueData, statusData, ratingsData, topCustomersData }) {
  const totalRev = revenueData?.revenue ?? revenueData?.totalRevenue ?? 0;
  const totalOrders = statusData?.total ?? revenueData?.totalOrders ?? 0;
  const avgRating = ratingsData?.averageRating ?? 'N/A';
  const customerCount = topCustomersData?.customers?.length ?? topCustomersData?.topCustomers?.length ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Total Revenue */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
          <h3 className="text-xl font-black text-white">{formatCurrency(totalRev)}</h3>
        </div>
      </div>

      {/* Total Orders */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
          <h3 className="text-xl font-black text-white">{totalOrders.toLocaleString()}</h3>
        </div>
      </div>

      {/* Avg Rating */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Star className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Rating</span>
          <h3 className="text-xl font-black text-white">{avgRating} <span className="text-xs text-slate-400 font-normal">/ 5</span></h3>
        </div>
      </div>

      {/* Top Customers */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Spenders</span>
          <h3 className="text-xl font-black text-white">{customerCount} Recorded</h3>
        </div>
      </div>
    </div>
  );
}
