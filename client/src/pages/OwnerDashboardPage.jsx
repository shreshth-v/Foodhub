import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../features/restaurantSlice';
import {
  fetchMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../features/menuSlice';
import {
  fetchRestaurantOrders,
  updateOrderStatus,
} from '../features/orderSlice';
import {
  fetchRestaurantRevenue,
  fetchTopDishes,
  fetchPeakHours,
  fetchStatusBreakdown,
  fetchTopCustomers,
  fetchRatings,
} from '../features/analyticsSlice';
import { useAuth } from '../hooks/useAuth';

import AddRestaurantModal from '../components/restaurant/AddRestaurantModal';
import AddMenuItemModal from '../components/restaurant/AddMenuItemModal';
import MenuItemCard from '../components/restaurant/MenuItemCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AnalyticsSummaryCards from '../components/analytics/AnalyticsSummaryCards';
import RevenueChart from '../components/analytics/RevenueChart';
import TopDishesTable from '../components/analytics/TopDishesTable';
import PeakHoursChart from '../components/analytics/PeakHoursChart';
import StatusBreakdown from '../components/analytics/StatusBreakdown';

import {
  Store,
  UtensilsCrossed,
  ListOrdered,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';
import { ORDER_STATUSES } from '../utils/constants';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function OwnerDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { list: restaurants, loading: resLoading } = useSelector((state) => state.restaurants);
  const { items: menuItems, loading: menuLoading } = useSelector((state) => state.menu);
  const { restaurantOrders, loading: orderLoading } = useSelector((state) => state.orders);
  const analytics = useSelector((state) => state.analytics);

  const [activeTab, setActiveTab] = useState('restaurants'); // 'restaurants' | 'menu' | 'orders' | 'analytics'
  const [selectedResId, setSelectedResId] = useState('');

  // Modals state
  const [showResModal, setShowResModal] = useState(false);
  const [editingRes, setEditingRes] = useState(null);

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchRestaurants({ page: 1, limit: 100 }));
  }, [dispatch]);

  // Set default selected restaurant when list changes
  useEffect(() => {
    if (restaurants.length > 0 && !selectedResId) {
      setSelectedResId(restaurants[0]._id);
    }
  }, [restaurants, selectedResId]);

  // Fetch menu, orders, analytics when selected restaurant or active tab changes
  useEffect(() => {
    if (selectedResId) {
      if (activeTab === 'menu') {
        dispatch(fetchMenu({ restaurantId: selectedResId }));
      } else if (activeTab === 'orders') {
        dispatch(fetchRestaurantOrders({ restaurantId: selectedResId, status: orderStatusFilter }));
      } else if (activeTab === 'analytics') {
        dispatch(fetchRestaurantRevenue({ id: selectedResId }));
        dispatch(fetchTopDishes({ id: selectedResId }));
        dispatch(fetchPeakHours(selectedResId));
        dispatch(fetchStatusBreakdown(selectedResId));
        dispatch(fetchTopCustomers(selectedResId));
        dispatch(fetchRatings(selectedResId));
      }
    }
  }, [selectedResId, activeTab, orderStatusFilter, dispatch]);

  // Handler: Create / Edit Restaurant
  const handleSaveRestaurant = async (formData) => {
    try {
      if (editingRes) {
        await dispatch(updateRestaurant({ id: editingRes._id, data: formData })).unwrap();
        toast.success('Restaurant updated');
      } else {
        const created = await dispatch(createRestaurant(formData)).unwrap();
        toast.success('Restaurant created!');
        setSelectedResId(created._id);
      }
      setShowResModal(false);
      setEditingRes(null);
    } catch (err) {
      toast.error(err || 'Failed to save restaurant');
    }
  };

  // Handler: Delete Restaurant
  const handleDeleteRestaurant = async (resId) => {
    if (!window.confirm('Are you sure you want to delete this restaurant and its menu?')) return;
    try {
      await dispatch(deleteRestaurant(resId)).unwrap();
      toast.success('Restaurant deleted');
      if (selectedResId === resId) {
        setSelectedResId('');
      }
    } catch (err) {
      toast.error(err || 'Failed to delete restaurant');
    }
  };

  // Handler: Create / Edit Menu Item
  const handleSaveMenuItem = async (formData) => {
    if (!selectedResId) return;
    try {
      if (editingMenuItem) {
        await dispatch(
          updateMenuItem({ restaurantId: selectedResId, itemId: editingMenuItem._id, data: formData })
        ).unwrap();
        toast.success('Menu item updated');
      } else {
        await dispatch(
          createMenuItem({ restaurantId: selectedResId, data: formData })
        ).unwrap();
        toast.success('Menu item added');
      }
      setShowMenuModal(false);
      setEditingMenuItem(null);
    } catch (err) {
      toast.error(err || 'Failed to save menu item');
    }
  };

  // Handler: Delete Menu Item
  const handleDeleteMenuItem = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await dispatch(deleteMenuItem({ restaurantId: selectedResId, itemId })).unwrap();
      toast.success('Menu item deleted');
    } catch (err) {
      toast.error(err || 'Failed to delete menu item');
    }
  };

  // Handler: Change Order Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      dispatch(fetchRestaurantOrders({ restaurantId: selectedResId, status: orderStatusFilter }));
    } catch (err) {
      toast.error(err || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Store className="w-8 h-8 text-rose-500" />
            Partner Restaurant Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Welcome back, <span className="text-white font-bold">{user?.name}</span>. Manage your restaurants, menus, orders, and real-time analytics.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingRes(null);
            setShowResModal(true);
          }}
          className="px-5 py-2.5 brand-gradient text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Restaurant</span>
        </button>
      </div>

      {/* Tabs bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('restaurants')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'restaurants'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>My Restaurants ({restaurants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'menu'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          <span>Menu Management</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Live Orders</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all ${
            activeTab === 'analytics'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Restaurant Analytics</span>
        </button>
      </div>

      {/* Selected Restaurant Selector for Menu, Orders, Analytics */}
      {activeTab !== 'restaurants' && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Restaurant:</span>
          <select
            value={selectedResId}
            onChange={(e) => setSelectedResId(e.target.value)}
            className="bg-slate-800 text-white font-bold text-sm px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-rose-500"
          >
            {restaurants.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} ({r.city} - {r.area})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* TAB 1: Restaurants List */}
      {activeTab === 'restaurants' && (
        <div>
          {resLoading ? (
            <LoadingSpinner message="Fetching your restaurants..." />
          ) : restaurants.length === 0 ? (
            <EmptyState
              title="No restaurants registered"
              description="Click 'Add Restaurant' above to register your first restaurant!"
              icon="food"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((res) => (
                <div
                  key={res._id}
                  className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white">{res.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          res.isOpen !== false
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {res.isOpen !== false ? 'OPEN' : 'CLOSED'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{res.area}, {res.city}</span>
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.cuisines?.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedResId(res._id);
                          setActiveTab('menu');
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg"
                      >
                        Manage Menu
                      </button>
                      <button
                        onClick={() => {
                          setSelectedResId(res._id);
                          setActiveTab('orders');
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg"
                      >
                        Orders
                      </button>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingRes(res);
                          setShowResModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRestaurant(res._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Menu Management */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Menu Items ({menuItems.length})</h2>
            <button
              onClick={() => {
                setEditingMenuItem(null);
                setShowMenuModal(true);
              }}
              disabled={!selectedResId}
              className="px-4 py-2 brand-gradient text-white font-bold text-xs rounded-xl flex items-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              <span>Add Menu Item</span>
            </button>
          </div>

          {menuLoading ? (
            <LoadingSpinner message="Fetching menu items..." />
          ) : menuItems.length === 0 ? (
            <EmptyState
              title="No menu items found"
              description="Click 'Add Menu Item' to create starters, main course, or beverages!"
              icon="food"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  restaurantId={selectedResId}
                  isOwner={true}
                  onEdit={(itemToEdit) => {
                    setEditingMenuItem(itemToEdit);
                    setShowMenuModal(true);
                  }}
                  onDelete={(itemId) => handleDeleteMenuItem(itemId)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Order status filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['', 'placed', 'preparing', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-colors ${
                  orderStatusFilter === st
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st || 'All Orders'}
              </button>
            ))}
          </div>

          {orderLoading ? (
            <LoadingSpinner message="Fetching live restaurant orders..." />
          ) : restaurantOrders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="Orders placed by customers will appear here."
              icon="cart"
            />
          ) : (
            <div className="space-y-4">
              {restaurantOrders.map((order) => {
                const statusInfo = ORDER_STATUSES[order.status] || { label: order.status };
                return (
                  <div
                    key={order._id}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold">
                          Customer: <span className="text-white font-bold">{order.customer?.name || 'Customer'}</span>
                        </span>
                        <p className="text-[11px] text-slate-500">{formatDate(order.createdAt)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 rounded-lg flex justify-between">
                          <span className="text-slate-300 font-semibold">{it.name} × {it.quantity}</span>
                          <span className="text-slate-400 font-bold">{formatCurrency(it.price * it.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action transitions: placed -> preparing/cancelled, preparing -> delivered/cancelled */}
                    <div className="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-800">
                      <span className="text-xs font-black text-rose-400">Total: {formatCurrency(order.totalAmount)}</span>

                      <div className="flex flex-wrap gap-2">
                        {order.status === 'placed' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'preparing')}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" /> Accept & Prepare
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold rounded-lg flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </>
                        )}

                        {order.status === 'preparing' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" /> Mark Delivered
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold rounded-lg flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Restaurant Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsSummaryCards
            revenueData={analytics.revenue}
            statusData={analytics.statusBreakdown}
            ratingsData={analytics.ratings}
            topCustomersData={analytics.topCustomers}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={analytics.revenue} />
            <StatusBreakdown data={analytics.statusBreakdown} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopDishesTable data={analytics.topDishes} />
            <PeakHoursChart data={analytics.peakHours} />
          </div>
        </div>
      )}

      {/* Add / Edit Restaurant Modal */}
      <AddRestaurantModal
        isOpen={showResModal}
        onClose={() => {
          setShowResModal(false);
          setEditingRes(null);
        }}
        onSubmit={handleSaveRestaurant}
        initialData={editingRes}
      />

      {/* Add / Edit Menu Item Modal */}
      <AddMenuItemModal
        isOpen={showMenuModal}
        onClose={() => {
          setShowMenuModal(false);
          setEditingMenuItem(null);
        }}
        onSubmit={handleSaveMenuItem}
        initialData={editingMenuItem}
      />
    </div>
  );
}
