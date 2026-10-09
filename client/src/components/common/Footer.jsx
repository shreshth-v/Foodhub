import React from 'react';
import { UtensilsCrossed, Heart, ShieldCheck, Zap } from 'lucide-react';
import { CITIES } from '../../utils/constants';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white">
                Food<span className="text-rose-500">Hub</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Discover the best food & drinks in your city. Fresh, fast delivery straight to your doorstep.
            </p>
          </div>

          {/* Top cities */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Popular Cities
            </h3>
            <ul className="space-y-2 text-sm">
              {CITIES.slice(0, 6).map((city) => (
                <li key={city}>
                  <Link to={`/search?city=${city}`} className="hover:text-rose-400 transition-colors">
                    Food delivery in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-rose-400 transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-rose-400 transition-colors">Search Restaurants</Link></li>
              <li><Link to="/orders/my" className="hover:text-rose-400 transition-colors">Order History</Link></li>
              <li><Link to="/owner/dashboard" className="hover:text-rose-400 transition-colors">Partner Dashboard</Link></li>
              <li><Link to="/analytics/platform" className="hover:text-rose-400 transition-colors">Platform Insights</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Why FoodHub?
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Superfast Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Hygienic Food</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Top Rated Restaurants</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} FoodHub Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, Redux Toolkit, Tailwind CSS & Express
          </p>
        </div>
      </div>
    </footer>
  );
}
