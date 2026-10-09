import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCityRevenue, fetchMonthlyTrend } from '../features/analyticsSlice';
import CityRevenueChart from '../components/analytics/CityRevenueChart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function PlatformAnalyticsPage() {
  const dispatch = useDispatch();
  const { cityRevenue, monthlyTrend, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCityRevenue());
    dispatch(fetchMonthlyTrend());
  }, [dispatch]);

  const monthsList = monthlyTrend?.months || [];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-400" />
          Platform-Wide Analytics
        </h1>
        <p className="text-sm text-slate-400">
          Aggregated revenue trends across Indian cities and 12-month performance breakdown using MongoDB aggregation pipelines.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Calculating platform analytics..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* City Revenue Component */}
          <CityRevenueChart data={cityRevenue} />

          {/* Monthly Trend Component */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              12-Month Revenue Trend
            </h3>

            {monthsList.length === 0 ? (
              <p className="text-xs text-slate-400">No monthly trend data available.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {monthsList.map((m) => (
                  <div key={m.month} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white block">{m.month}</span>
                      <span className="text-[10px] text-slate-500">{m.orders?.toLocaleString() || 0} orders</span>
                    </div>
                    <span className="font-black text-indigo-400 text-sm">
                      {formatCurrency(m.revenue || 0)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
