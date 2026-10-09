import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import CheckoutModal from './CheckoutModal';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, totalCount, totalAmount, restaurantName, isOpen, toggle, updateQty, remove, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  if (!isOpen) return null;

  const handleProceedCheckout = () => {
    if (!isAuthenticated) {
      toggle(false);
      navigate('/login');
      return;
    }
    setShowCheckout(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col justify-between shadow-2xl animate-slideLeft">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Cart</h3>
                <p className="text-xs text-slate-400">
                  {restaurantName ? `From ${restaurantName}` : 'No restaurant selected'}
                </p>
              </div>
            </div>

            <button
              onClick={() => toggle(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400">
                <ShoppingBag className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-base font-bold text-slate-300">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Add delicious dishes from your favorite restaurants to build your order!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                    <p className="text-xs font-semibold text-rose-400 mt-0.5">
                      {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg p-1">
                    <button
                      onClick={() => updateQty(item.menuItemId, item.quantity - 1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.menuItemId, item.quantity + 1)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => remove(item.menuItemId)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-rose-400 text-lg font-black">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clear}
                  className="px-3.5 py-3 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleProceedCheckout}
                  className="flex-1 py-3 px-4 brand-gradient text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition-transform active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Checkout modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
    </>
  );
}
