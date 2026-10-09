import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Search,
  ShoppingBag,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  ListOrdered
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useRestaurant } from '../../hooks/useRestaurant';
import { CITIES } from '../../utils/constants';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isOwner } = useAuth();
  const { totalCount, toggle } = useCart();
  const { selectedCity, setCity } = useRestaurant();

  const handleCityChange = (e) => {
    setCity(e.target.value);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand logo & City selector */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5.5 h-5.5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-sans">
              Food<span className="text-rose-500">Hub</span>
            </span>
          </Link>

          {/* City selector dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 rounded-full px-3 py-1.5 text-sm text-slate-300 hover:border-rose-500/50 transition-colors">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="bg-transparent text-slate-200 text-sm font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="" className="bg-slate-900 text-slate-200">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-slate-900 text-slate-200">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search quick button */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 rounded-full text-sm transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search for restaurants or dishes...</span>
          </button>
        </div>

        {/* Action icons & Auth state */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/search')}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            title="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Owner Dashboard link */}
          {isAuthenticated && isOwner && (
            <Link
              to="/owner/dashboard"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Owner Panel</span>
            </Link>
          )}

          {/* Platform Analytics link */}
          {isAuthenticated && (
            <Link
              to="/analytics/platform"
              className="hidden xl:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Platform Stats</span>
            </Link>
          )}

          {/* My Orders link */}
          {isAuthenticated && !isOwner && (
            <Link
              to="/orders/my"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
            >
              <ListOrdered className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">My Orders</span>
            </Link>
          )}

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => toggle(true)}
            className="relative p-2 text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl transition-transform active:scale-95"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-rose-400" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white font-bold text-xs rounded-full flex items-center justify-center animate-pulse shadow-md">
                {totalCount}
              </span>
            )}
          </button>

          {/* User Auth Info */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm font-semibold text-white brand-gradient hover:opacity-95 rounded-lg shadow-md shadow-rose-500/20 transition-transform active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
