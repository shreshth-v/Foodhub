import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { CITIES, CUISINES } from '../../utils/constants';

export default function AddRestaurantModal({ isOpen, onClose, onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    city: CITIES[0],
    area: '',
    cuisines: [],
    lng: 77.4126,
    lat: 23.2599,
    isOpen: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        city: initialData.city || CITIES[0],
        area: initialData.area || '',
        cuisines: initialData.cuisines || [],
        lng: initialData.location?.coordinates?.[0] ?? 77.4126,
        lat: initialData.location?.coordinates?.[1] ?? 23.2599,
        isOpen: initialData.isOpen !== false,
      });
    } else {
      setFormData({
        name: '',
        city: CITIES[0],
        area: '',
        cuisines: ['Biryani', 'North Indian'],
        lng: 77.4126,
        lat: 23.2599,
        isOpen: true,
      });
    }
  }, [initialData, isOpen]);

  const toggleCuisine = (cuisine) => {
    setFormData((prev) => {
      const exists = prev.cuisines.includes(cuisine);
      if (exists) {
        return { ...prev, cuisines: prev.cuisines.filter((c) => c !== cuisine) };
      } else {
        return { ...prev, cuisines: [...prev.cuisines, cuisine] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      lng: Number(formData.lng),
      lat: Number(formData.lat),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Restaurant Details' : 'Register New Restaurant'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Restaurant Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Royal Biryani House"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
          />
        </div>

        {/* City & Area */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              City
            </label>
            <select
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Area / Locality
            </label>
            <input
              type="text"
              required
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="e.g. MP Nagar"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>
        </div>

        {/* Cuisines selection pills */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Select Cuisines
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
            {CUISINES.map((c) => {
              const active = formData.cuisines.includes(c);
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => toggleCuisine(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-rose-600 text-white border border-rose-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Location Lng / Lat */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Longitude (lng)
            </label>
            <input
              type="number"
              step="any"
              required
              value={formData.lng}
              onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
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
              value={formData.lat}
              onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Is Open toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isOpenCheckbox"
            checked={formData.isOpen}
            onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
            className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700 focus:ring-rose-500"
          />
          <label htmlFor="isOpenCheckbox" className="text-sm font-semibold text-slate-300">
            Currently Open for Orders
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white brand-gradient rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-transform active:scale-95"
          >
            {loading ? 'Saving...' : initialData ? 'Save Changes' : 'Create Restaurant'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
