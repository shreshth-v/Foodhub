import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem('foodhub_cart');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore storage parse errors
  }
  return { items: [], restaurantId: null, restaurantName: null };
};

const saveCartToStorage = (cartState) => {
  try {
    localStorage.setItem(
      'foodhub_cart',
      JSON.stringify({
        items: cartState.items,
        restaurantId: cartState.restaurantId,
        restaurantName: cartState.restaurantName,
      })
    );
  } catch {
    // Ignore storage write errors
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: initialState.items || [],
    restaurantId: initialState.restaurantId || null,
    restaurantName: initialState.restaurantName || null,
    isOpen: false,
  },
  reducers: {
    toggleCart: (state, action) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },
    addItem: (state, action) => {
      const { item, restaurantId, restaurantName } = action.payload;

      // If cart belongs to a different restaurant, clear it first
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        state.items = [];
      }

      state.restaurantId = restaurantId;
      state.restaurantName = restaurantName;

      const existingIndex = state.items.findIndex((i) => i.menuItemId === item._id);
      if (existingIndex >= 0) {
        if (state.items[existingIndex].quantity < 20) {
          state.items[existingIndex].quantity += 1;
        }
      } else {
        state.items.push({
          menuItemId: item._id,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          category: item.category,
          quantity: 1,
        });
      }

      saveCartToStorage(state);
    },
    removeItem: (state, action) => {
      const menuItemId = action.payload;
      state.items = state.items.filter((i) => i.menuItemId !== menuItemId);
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const existing = state.items.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.menuItemId !== menuItemId);
        } else {
          existing.quantity = Math.min(20, Math.max(1, quantity));
        }
      }
      if (state.items.length === 0) {
        state.restaurantId = null;
        state.restaurantName = null;
      }
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurantId = null;
      state.restaurantName = null;
      saveCartToStorage(state);
    },
  },
});

export const { toggleCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalCount = (state) =>
  state.cart.items.reduce((total, i) => total + i.quantity, 0);
export const selectCartTotalAmount = (state) =>
  state.cart.items.reduce((total, i) => total + i.price * i.quantity, 0);

export default cartSlice.reducer;
