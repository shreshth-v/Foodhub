import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchRestaurants = createAsyncThunk(
  'restaurants/fetchRestaurants',
  async ({ page = 1, limit = 12, city = '' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (city) params.append('city', city);
      const response = await api.get(`/restaurants?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load restaurants');
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'restaurants/fetchRestaurantById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data.restaurant;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Restaurant not found');
    }
  }
);

export const searchRestaurants = createAsyncThunk(
  'restaurants/searchRestaurants',
  async ({ q = '', city = '', cuisine = '', page = 1 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page });
      if (q) params.append('q', q);
      if (city) params.append('city', city);
      if (cuisine) params.append('cuisine', cuisine);
      const response = await api.get(`/restaurants/search?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchNearbyRestaurants = createAsyncThunk(
  'restaurants/fetchNearbyRestaurants',
  async ({ lng, lat, radius = 5000 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ lng, lat, radius });
      const response = await api.get(`/restaurants/nearby?${params.toString()}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch nearby restaurants');
    }
  }
);

export const createRestaurant = createAsyncThunk(
  'restaurants/createRestaurant',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/restaurants', data);
      return response.data.restaurant;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create restaurant');
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  'restaurants/updateRestaurant',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/restaurants/${id}`, data);
      return response.data.restaurant;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update restaurant');
    }
  }
);

export const deleteRestaurant = createAsyncThunk(
  'restaurants/deleteRestaurant',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/restaurants/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete restaurant');
    }
  }
);

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    total: 0,
    page: 1,
    totalPages: 1,
    currentRestaurant: null,
    searchResults: null,
    nearbyRestaurants: null,
    loading: false,
    detailLoading: false,
    searchLoading: false,
    nearbyLoading: false,
    actionLoading: false,
    error: null,
    selectedCity: '',
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = null;
    },
    clearNearbyResults: (state) => {
      state.nearbyRestaurants = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchRestaurants
      .addCase(fetchRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.restaurants;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchRestaurantById
      .addCase(fetchRestaurantById.pending, (state) => {
        state.detailLoading = true;
        state.currentRestaurant = null;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchRestaurantById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // searchRestaurants
      .addCase(searchRestaurants.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchRestaurants.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchRestaurants.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      })
      // fetchNearbyRestaurants
      .addCase(fetchNearbyRestaurants.pending, (state) => {
        state.nearbyLoading = true;
      })
      .addCase(fetchNearbyRestaurants.fulfilled, (state, action) => {
        state.nearbyLoading = false;
        state.nearbyRestaurants = action.payload;
      })
      .addCase(fetchNearbyRestaurants.rejected, (state, action) => {
        state.nearbyLoading = false;
        state.error = action.payload;
      })
      // createRestaurant
      .addCase(createRestaurant.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // updateRestaurant
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.actionLoading = false;
        const updated = action.payload;
        if (state.currentRestaurant && state.currentRestaurant._id === updated._id) {
          state.currentRestaurant = { ...state.currentRestaurant, ...updated };
        }
        state.list = state.list.map((r) => (r._id === updated._id ? updated : r));
      })
      // deleteRestaurant
      .addCase(deleteRestaurant.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.list = state.list.filter((r) => r._id !== action.payload);
        if (state.currentRestaurant?._id === action.payload) {
          state.currentRestaurant = null;
        }
      });
  },
});

export const { setSelectedCity, clearSearchResults, clearNearbyResults } = restaurantSlice.actions;
export default restaurantSlice.reducer;
