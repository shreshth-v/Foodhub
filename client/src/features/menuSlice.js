import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async ({ restaurantId, category = '', isVeg }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (isVeg !== undefined && isVeg !== null && isVeg !== '') {
        params.append('isVeg', isVeg);
      }
      const response = await api.get(`/restaurants/${restaurantId}/menu?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load menu');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/createMenuItem',
  async ({ restaurantId, data }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/restaurants/${restaurantId}/menu`, data);
      return response.data.menuItem;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add menu item');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/updateMenuItem',
  async ({ restaurantId, itemId, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/restaurants/${restaurantId}/menu/${itemId}`, data);
      return response.data.menuItem;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update menu item');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/deleteMenuItem',
  async ({ restaurantId, itemId }, { rejectWithValue }) => {
    try {
      await api.delete(`/restaurants/${restaurantId}/menu/${itemId}`);
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete menu item');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    restaurantInfo: null,
    items: [],
    count: 0,
    loading: false,
    actionLoading: false,
    error: null,
    selectedCategory: 'All',
    isVegOnly: false,
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setIsVegOnly: (state, action) => {
      state.isVegOnly = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurantInfo = action.payload.restaurant;
        state.items = action.payload.menuItems;
        state.count = action.payload.count;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMenuItem.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.push(action.payload);
        state.count += 1;
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.items = state.items.map((item) => (item._id === updated._id ? updated : item));
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.count -= 1;
      });
  },
});

export const { setSelectedCategory, setIsVegOnly } = menuSlice.actions;
export default menuSlice.reducer;
