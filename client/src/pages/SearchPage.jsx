import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRestaurant } from '../hooks/useRestaurant';
import { CITIES, CUISINES } from '../utils/constants';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { Search, Filter, X } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { search, searchResults, searchLoading } = useRestaurant();

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [cuisine, setCuisine] = useState(searchParams.get('cuisine') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const queryVal = searchParams.get('q') || '';
    const cityVal = searchParams.get('city') || '';
    const cuisineVal = searchParams.get('cuisine') || '';
    const pageVal = Number(searchParams.get('page')) || 1;

    setQ(queryVal);
    setCity(cityVal);
    setCuisine(cuisineVal);
    setPage(pageVal);

    search({ q: queryVal, city: cityVal, cuisine: cuisineVal, page: pageVal });
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (q) newParams.set('q', q);
    if (city) newParams.set('city', city);
    if (cuisine) newParams.set('cuisine', cuisine);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setQ('');
    setCity('');
    setCuisine('');
    setSearchParams({});
  };

  const resultsList = searchResults?.results || [];
  const totalCount = searchResults?.total || resultsList.length;
  const cuisineCounts = searchResults?.cuisineCounts || [];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-white">Search Restaurants & Cuisines</h1>
        <p className="text-sm text-slate-400">
          Find your favorite restaurants using indexed MongoDB search and faceted aggregation pipelines.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by restaurant name or dish..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm shadow-inner"
            />
          </div>

          {/* City select */}
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              const p = new URLSearchParams(searchParams);
              if (e.target.value) p.set('city', e.target.value);
              else p.delete('city');
              setSearchParams(p);
            }}
            className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
          >
            <option value="">All Cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-6 py-3 brand-gradient text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-rose-500/20"
          >
            Search
          </button>
        </form>

        {/* Active Filters Bar */}
        {(q || city || cuisine) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Active Filters:</span>
            {q && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700">
                Query: "{q}"
              </span>
            )}
            {city && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-medium border border-slate-700">
                City: {city}
              </span>
            )}
            {cuisine && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-lg text-xs font-bold border border-rose-500/30">
                Cuisine: {cuisine}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 ml-2 font-semibold"
            >
              <X className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Facet Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-rose-500" />
              Filter by Cuisine
            </h3>

            <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete('cuisine');
                  setSearchParams(p);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors ${
                  !cuisine
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>All Cuisines</span>
              </button>

              {CUISINES.map((c) => {
                const countObj = cuisineCounts.find((item) => item.cuisine === c);
                const count = countObj?.count;
                const active = cuisine === c;

                return (
                  <button
                    key={c}
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.set('cuisine', c);
                      setSearchParams(p);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex justify-between items-center transition-colors ${
                      active
                        ? 'bg-rose-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c}</span>
                    {count !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${active ? 'bg-rose-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Search Results <span className="text-slate-500 font-normal">({totalCount} found)</span>
            </h2>
          </div>

          {searchLoading ? (
            <LoadingSpinner message="Searching restaurants database..." />
          ) : resultsList.length === 0 ? (
            <EmptyState
              title="No matching restaurants"
              description="Try searching for a different dish name or city."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultsList.map((res) => (
                <RestaurantCard key={res._id} restaurant={res} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
