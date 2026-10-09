import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../features/orderSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ReviewFormModal from '../components/restaurant/ReviewFormModal';
import { ORDER_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ShoppingBag, Star, Clock, CreditCard, CheckCircle, MapPin } from 'lucide-react';

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const { myOrders, myOrdersTotal, myOrdersPage, myOrdersTotalPages, loading } = useSelector((state) => state.orders);

  const [reviewModalOrder, setReviewModalOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchMyOrders({ page: newPage, limit: 10 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-rose-500" />
          My Order History
        </h1>
        <p className="text-sm text-slate-400">
          Track active orders, view past order history, and submit reviews for delivered food.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your order history..." />
      ) : myOrders.length === 0 ? (
        <EmptyState
          title="No orders placed yet"
          description="Browse nearby restaurants and place your first delicious order!"
          icon="cart"
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {myOrders.map((order) => {
              const statusInfo = ORDER_STATUSES[order.status] || { label: order.status, color: 'bg-slate-800 text-slate-300' };

              return (
                <div
                  key={order._id}
                  className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {order.restaurant?.name || 'Restaurant'}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{order.restaurant?.area}, {order.restaurant?.city}</span>
                        <span className="text-slate-600 font-bold">•</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Order items list */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between text-xs">
                          <span className="text-slate-300 font-semibold">
                            {item.name} <span className="text-rose-400 font-bold">× {item.quantity}</span>
                          </span>
                          <span className="text-slate-400 font-bold">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer summary & Review Action */}
                  <div className="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span className="uppercase font-bold text-slate-300">{order.paymentMethod}</span>
                      </div>
                      <span>
                        Total: <span className="text-sm font-black text-rose-400">{formatCurrency(order.totalAmount)}</span>
                      </span>
                    </div>

                    {/* Review Button for Delivered Orders */}
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => setReviewModalOrder(order._id)}
                        className="px-4 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span>Rate & Review Order</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={myOrdersPage}
            totalPages={myOrdersTotalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Review Modal */}
      <ReviewFormModal
        isOpen={!!reviewModalOrder}
        onClose={() => setReviewModalOrder(null)}
        orderId={reviewModalOrder}
        onReviewSuccess={() => dispatch(fetchMyOrders({ page: myOrdersPage, limit: 10 }))}
      />
    </div>
  );
}
