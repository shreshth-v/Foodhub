import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center text-rose-500 shadow-inner">
        <Utensils className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-white">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md">
        Oops! The page or restaurant menu item you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 brand-gradient text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-500/20 flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
