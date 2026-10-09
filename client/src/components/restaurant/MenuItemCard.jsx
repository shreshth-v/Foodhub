import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { VegBadge } from '../common/Badge';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';

export default function MenuItemCard({ item, restaurantId, restaurantName, isOwner = false, onEdit, onDelete }) {
  const { items, add, updateQty, remove } = useCart();

  const cartItem = items.find((i) => i.menuItemId === item._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    add(item, restaurantId, restaurantName);
    toast.success(`Added ${item.name} to cart`, { id: item._id });
  };

  const handleIncrease = () => {
    updateQty(item._id, currentQuantity + 1);
  };

  const handleDecrease = () => {
    if (currentQuantity === 1) {
      remove(item._id);
    } else {
      updateQty(item._id, currentQuantity - 1);
    }
  };

  return (
    <div className={`glass-panel p-4 rounded-xl flex items-center justify-between gap-4 border border-slate-800 hover:border-slate-700 transition-all ${!item.isAvailable ? 'opacity-60' : ''}`}>
      
      {/* Details */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <VegBadge isVeg={item.isVeg} />
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700/50">
            {item.category}
          </span>
          {!item.isAvailable && (
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Unavailable
            </span>
          )}
        </div>

        <h4 className="text-base font-bold text-white leading-snug">{item.name}</h4>
        <p className="text-sm font-black text-rose-400">{formatCurrency(item.price)}</p>
      </div>

      {/* Action buttons */}
      {isOwner ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="shrink-0">
          {currentQuantity > 0 ? (
            <div className="flex items-center bg-rose-600 text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-rose-600/20">
              <button
                onClick={handleDecrease}
                className="px-3 py-2 hover:bg-rose-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-2 text-sm font-extrabold">{currentQuantity}</span>
              <button
                onClick={handleIncrease}
                className="px-3 py-2 hover:bg-rose-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!item.isAvailable}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>ADD</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
