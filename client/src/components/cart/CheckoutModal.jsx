import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { CreditCard, QrCode, Banknote, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../../features/orderSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CheckoutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount, restaurantId, restaurantName, clear, toggle } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const { placingOrder } = useSelector((state) => state.orders);

  const getMethodIcon = (id) => {
    switch (id) {
      case 'upi':
        return <QrCode className="w-5 h-5 text-indigo-400" />;
      case 'card':
        return <CreditCard className="w-5 h-5 text-amber-400" />;
      default:
        return <Banknote className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handlePlaceOrder = async () => {
    if (!restaurantId || items.length === 0) return;

    const payloadItems = items.map((i) => ({
      menuItemId: i.menuItemId,
      quantity: i.quantity,
    }));

    try {
      await dispatch(placeOrder({ restaurantId, items: payloadItems, paymentMethod })).unwrap();
      toast.success('Order placed successfully!');
      clear();
      onClose();
      toggle(false);
      navigate('/orders/my');
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Order">
      <div className="space-y-6">
        
        {/* Restaurant summary */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordering from</p>
          <h4 className="text-base font-bold text-white mt-0.5">{restaurantName}</h4>
          <p className="text-xs text-slate-400 mt-1">{items.length} unique items selected</p>
        </div>

        {/* Items summary */}
        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {items.map((i) => (
            <div key={i.menuItemId} className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">
                {i.name} <span className="text-slate-500 font-bold">× {i.quantity}</span>
              </span>
              <span className="text-slate-200 font-bold">{formatCurrency(i.price * i.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Payment method selector */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="space-y-2.5">
            {PAYMENT_METHODS.map((pm) => {
              const active = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    active
                      ? 'bg-rose-950/40 border-rose-500 text-white shadow-md shadow-rose-950/30'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getMethodIcon(pm.id)}
                    <span className="text-sm font-semibold">{pm.label}</span>
                  </div>
                  {active && <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total & Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Total Payable</span>
            <span className="text-xl font-black text-rose-400">{formatCurrency(totalAmount)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            className="px-6 py-3 brand-gradient text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-500/20 disabled:opacity-50 transition-transform active:scale-95"
          >
            {placingOrder ? 'Placing Order...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
