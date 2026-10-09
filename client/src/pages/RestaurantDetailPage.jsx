import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantById } from '../features/restaurantSlice';
import { fetchMenu, setSelectedCategory, setIsVegOnly } from '../features/menuSlice';
import { fetchRestaurantReviews } from '../features/reviewSlice';
import MenuItemCard from '../components/restaurant/MenuItemCard';
import ReviewCard from '../components/restaurant/ReviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { VegBadge, OpenStatusBadge } from '../components/common/Badge';
import { useCart } from '../hooks/useCart';
import { MapPin, Star, Utensils, MessageSquare, ShoppingBag, ArrowRight } from 'lucide-react';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRestaurant, detailLoading } = useSelector((state) => state.restaurants);
  const { items: menuItems, count, loading: menuLoading, selectedCategory, isVegOnly } = useSelector((state) => state.menu);
  const { reviews, total: reviewsTotal, loading: reviewsLoading } = useSelector((state) => state.reviews);

  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'reviews'
  const { totalCount, totalAmount, toggle } = useCart();

  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById(id));
      dispatch(fetchMenu({ restaurantId: id, category: selectedCategory === 'All' ? '' : selectedCategory, isVeg: isVegOnly ? 'true' : undefined }));
      dispatch(fetchRestaurantReviews({ restaurantId: id, page: 1, limit: 10 }));
    }
  }, [id, selectedCategory, isVegOnly]);

  if (detailLoading || !currentRestaurant) {
    return <LoadingSpinner message="Loading restaurant menu & details..." />;
  }

  // Extract unique categories from menu items
  const categoriesList = ['All', ...new Set(menuItems.map((i) => i.category).filter(Boolean))];

  return (
    <div className="space-y-8 pb-24">
      
      {/* Restaurant Cover Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <OpenStatusBadge isOpen={currentRestaurant.isOpen !== false} />
              {currentRestaurant.owner?.name && (
                <span className="text-xs text-slate-400 font-medium">
                  Owned by <span className="text-slate-200 font-semibold">{currentRestaurant.owner.name}</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white">{currentRestaurant.name}</h1>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{currentRestaurant.area}, {currentRestaurant.city}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <div>
                <span className="text-base font-black">4.3</span>
                <span className="text-[10px] text-slate-400 block">1,200+ ratings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cuisines pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
          {currentRestaurant.cuisines?.map((c, i) => (
            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs navigation (Menu vs Reviews) */}
      <div className="flex items-center gap-4 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 font-extrabold text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'menu'
              ? 'text-rose-500 border-rose-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Menu ({count})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 font-extrabold text-sm flex items-center gap-2 transition-colors border-b-2 ${
            activeTab === 'reviews'
              ? 'text-rose-500 border-rose-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews ({reviewsTotal})</span>
        </button>
      </div>

      {/* Menu Tab View */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          
          {/* Menu Filters: Veg Only Toggle & Category Pills */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
            
            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categoriesList.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => dispatch(setSelectedCategory(cat))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Veg toggle */}
            <button
              onClick={() => dispatch(setIsVegOnly(!isVegOnly))}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                isVegOnly
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isVegOnly ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>Veg Only</span>
            </button>
          </div>

          {/* Menu items grid */}
          {menuLoading ? (
            <LoadingSpinner message="Fetching delicious menu items..." />
          ) : menuItems.length === 0 ? (
            <EmptyState
              title="No menu items match criteria"
              description="Try changing the category filter or toggling Veg Only off."
              icon="food"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  restaurantId={currentRestaurant._id}
                  restaurantName={currentRestaurant.name}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab View */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Customer Reviews</h3>
          </div>

          {reviewsLoading ? (
            <LoadingSpinner message="Loading customer reviews..." />
          ) : reviews.length === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="Be the first customer to order and leave a review!"
              icon="folder"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <ReviewCard key={rev._id} review={rev} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sticky Bottom Cart Bar */}
      {totalCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-lg px-4 animate-bounceUp">
          <div className="brand-gradient p-4 rounded-2xl shadow-2xl flex items-center justify-between text-white border border-rose-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                {totalCount}
              </div>
              <div>
                <span className="text-xs text-rose-100 font-semibold block">Item Added</span>
                <span className="text-lg font-black">{totalAmount} INR</span>
              </div>
            </div>

            <button
              onClick={() => toggle(true)}
              className="px-5 py-2.5 bg-white text-rose-600 font-extrabold text-sm rounded-xl hover:bg-slate-100 flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
            >
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
