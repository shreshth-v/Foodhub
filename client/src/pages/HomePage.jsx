import React, { useEffect, useState } from 'react';
import { useRestaurant } from '../hooks/useRestaurant';
import { CITIES, CUISINES } from '../utils/constants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import { Utensils, Search, Compass, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { restaurants, total, page, totalPages, loading, selectedCity, setCity, loadRestaurants, findNearby, nearbyRestaurants, nearbyLoading } = useRestaurant();
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [geoCoords, setGeoCoords] = useState({ lng: 77.4126, lat: 23.2599, radius: 5000 });

  useEffect(() => {
    loadRestaurants({ page: 1, limit: 12, city: selectedCity });
  }, [selectedCity]);

  const handlePageChange = (newPage) => {
    loadRestaurants({ page: newPage, limit: 12, city: selectedCity });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleGetNearby = (e) => {
    e.preventDefault();
    findNearby({ lng: Number(geoCoords.lng), lat: Number(geoCoords.lat), radius: Number(geoCoords.radius) });
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fastest Food Delivery in India</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Craving Great Food? <br />
            <span className="brand-text-gradient">Delivered In Minutes.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl">
            Explore thousands of top-rated restaurants, authentic cuisines, and hot meals right around your location.
          </p>

          {/* Quick actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-3.5 brand-gradient text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2 hover:opacity-95 transition-transform active:scale-95"
            >
              <Search className="w-4.5 h-4.5" />
              <span>Explore All Restaurants</span>
            </button>

            <button
              onClick={() => setShowNearbyModal(true)}
              className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm rounded-xl flex items-center gap-2 transition-colors"
            >
              <Compass className="w-4.5 h-4.5 text-rose-400" />
              <span>Find Nearby Me</span>
            </button>
          </div>
        </div>
      </section>

      {/* City selector pills */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            Select City
          </h2>
          {selectedCity && (
            <button
              onClick={() => setCity('')}
              className="text-xs font-semibold text-rose-400 hover:underline"
            >
              View All Cities
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setCity('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              !selectedCity
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200'
            }`}
          >
            All Cities
          </button>
          {CITIES.map((city) => {
            const active = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setCity(city)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </section>

      {/* Cuisines Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-rose-500" />
          Popular Cuisines
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => navigate(`/search?cuisine=${encodeURIComponent(cuisine)}`)}
              className="glass-card p-3.5 rounded-xl border border-slate-800 text-left hover:border-rose-500/40 group transition-all"
            >
              <span className="text-xs font-bold text-slate-300 group-hover:text-rose-400 block truncate">
                {cuisine}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Explore dishes →</span>
            </button>
          ))}
        </div>
      </section>

      {/* Restaurants List Section */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-2xl font-black text-white">
              {selectedCity ? `Top Restaurants in ${selectedCity}` : 'Featured Restaurants'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {restaurants.length} of {total} restaurants
            </p>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching restaurants near you..." />
        ) : restaurants.length === 0 ? (
          <EmptyState
            title="No restaurants found"
            description={selectedCity ? `No restaurants listed in ${selectedCity} yet.` : 'No restaurants available.'}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {restaurants.map((res) => (
                <RestaurantCard key={res._id} restaurant={res} />
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>

      {/* Nearby Search Modal */}
      <Modal
        isOpen={showNearbyModal}
        onClose={() => setShowNearbyModal(false)}
        title="Find Nearby Restaurants ($geoNear)"
      >
        <form onSubmit={handleGetNearby} className="space-y-4">
          <p className="text-xs text-slate-400">
            Enter your GeoJSON longitude and latitude coordinates to query nearby restaurants.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Longitude (lng)
              </label>
              <input
                type="number"
                step="any"
                required
                value={geoCoords.lng}
                onChange={(e) => setGeoCoords({ ...geoCoords, lng: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Latitude (lat)
              </label>
              <input
                type="number"
                step="any"
                required
                value={geoCoords.lat}
                onChange={(e) => setGeoCoords({ ...geoCoords, lat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Search Radius (Meters)
            </label>
            <input
              type="number"
              required
              value={geoCoords.radius}
              onChange={(e) => setGeoCoords({ ...geoCoords, radius: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={nearbyLoading}
            className="w-full py-2.5 brand-gradient text-white font-bold text-sm rounded-xl"
          >
            {nearbyLoading ? 'Searching...' : 'Find Restaurants Nearby'}
          </button>

          {/* Nearby results view */}
          {nearbyRestaurants && (
            <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase">
                Found {nearbyRestaurants.count || 0} Nearby Restaurants
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {nearbyRestaurants.restaurants?.map((r) => (
                  <div key={r._id} className="p-2 bg-slate-800 rounded-lg flex justify-between text-xs">
                    <span className="font-bold text-white">{r.name} ({r.area})</span>
                    <span className="text-emerald-400 font-semibold">{r.distanceInMeters}m away</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
