import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import restaurantReducer from './restaurantSlice';
import menuReducer from './menuSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import reviewReducer from './reviewSlice';
import analyticsReducer from './analyticsSlice';
import { injectStore } from '../utils/api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurants: restaurantReducer,
    menu: menuReducer,
    cart: cartReducer,
    orders: orderReducer,
    reviews: reviewReducer,
    analytics: analyticsReducer,
  },
});

injectStore(store);

export default store;
