import React from 'react';
import { Utensils, SearchX, ShoppingBag, FolderOpen } from 'lucide-react';

export default function EmptyState({ title = 'No items found', description = 'Try adjusting your filters or search terms.', icon = 'search' }) {
  const icons = {
    search: SearchX,
    food: Utensils,
    cart: ShoppingBag,
    folder: FolderOpen,
  };

  const IconComponent = icons[icon] || SearchX;

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/50 border border-slate-800/80 rounded-2xl my-6">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <IconComponent className="w-8 h-8 text-rose-500/80" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
    </div>
  );
}
