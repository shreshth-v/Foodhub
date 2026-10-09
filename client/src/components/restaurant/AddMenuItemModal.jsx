import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

export default function AddMenuItemModal({ isOpen, onClose, onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Main Course',
    price: 250,
    isVeg: true,
    isAvailable: true,
  });

  const categories = [
    'Starters',
    'Main Course',
    'Biryani & Rice',
    'Breads',
    'Desserts',
    'Beverages',
    'Snacks',
    'Combos',
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Main Course',
        price: initialData.price || 250,
        isVeg: initialData.isVeg !== false,
        isAvailable: initialData.isAvailable !== false,
      });
    } else {
      setFormData({
        name: '',
        category: 'Main Course',
        price: 250,
        isVeg: true,
        isAvailable: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: Number(formData.price),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Menu Item' : 'Add New Menu Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Item Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Paneer Butter Masala"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 text-sm"
          />
        </div>

        {/* Category & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              list="categories-list"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
            <datalist id="categories-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Veg / Non-Veg radio selection */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Food Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isVeg: true })}
              className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                formData.isVeg
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Vegetarian
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isVeg: false })}
              className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                !formData.isVeg
                  ? 'bg-rose-950/80 text-rose-400 border-rose-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Non-Vegetarian
            </button>
          </div>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isAvailableCheckbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-4 h-4 rounded text-rose-600 bg-slate-800 border-slate-700 focus:ring-rose-500"
          />
          <label htmlFor="isAvailableCheckbox" className="text-sm font-semibold text-slate-300">
            In Stock / Available for Order
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
            {loading ? 'Saving...' : initialData ? 'Save Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
