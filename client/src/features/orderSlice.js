import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async ({ restaurantId, items, paymentMethod }, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', { restaurantId, items, paymentMethod });
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/my?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load your orders');
    }
  }
);

export const fetchRestaurantOrders = createAsyncThunk(
  'orders/fetchRestaurantOrders',
  async ({ restaurantId, page = 1, limit = 10, status = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (status) params.append('status', status);
      const response = await api.get(`/restaurants/${restaurantId}/orders?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load restaurant orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      return response.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    myOrders: [],
    myOrdersTotal: 0,
    myOrdersPage: 1,
    myOrdersTotalPages: 1,
    restaurantOrders: [],
    restaurantOrdersTotal: 0,
    restaurantOrdersPage: 1,
    restaurantOrdersTotalPages: 1,
    loading: false,
    placingOrder: false,
    statusUpdating: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // placeOrder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.myOrders.unshift(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })
      // fetchMyOrders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload.orders;
        state.myOrdersTotal = action.payload.total;
        state.myOrdersPage = action.payload.page;
        state.myOrdersTotalPages = action.payload.totalPages;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchRestaurantOrders
      .addCase(fetchRestaurantOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantOrders = action.payload.orders;
        state.restaurantOrdersTotal = action.payload.total;
        state.restaurantOrdersPage = action.payload.page;
        state.restaurantOrdersTotalPages = action.payload.totalPages;
      })
      .addCase(fetchRestaurantOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdating = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;
        const updated = action.payload;
        state.restaurantOrders = state.restaurantOrders.map((o) => (o._id === updated._id ? updated : o));
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
