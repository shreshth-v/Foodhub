import { useSelector, useDispatch } from 'react-redux';
import {
  toggleCart,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalAmount,
} from '../features/cartSlice';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalCount = useSelector(selectCartTotalCount);
  const totalAmount = useSelector(selectCartTotalAmount);
  const restaurantId = useSelector((state) => state.cart.restaurantId);
  const restaurantName = useSelector((state) => state.cart.restaurantName);
  const isOpen = useSelector((state) => state.cart.isOpen);

  return {
    items,
    totalCount,
    totalAmount,
    restaurantId,
    restaurantName,
    isOpen,
    toggle: (open) => dispatch(toggleCart(open)),
    add: (item, resId, resName) => dispatch(addItem({ item, restaurantId: resId, restaurantName: resName })),
    remove: (itemId) => dispatch(removeItem(itemId)),
    updateQty: (itemId, quantity) => dispatch(updateQuantity({ menuItemId: itemId, quantity })),
    clear: () => dispatch(clearCart()),
  };
}
