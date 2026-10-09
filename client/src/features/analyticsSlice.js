import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchRestaurantRevenue = createAsyncThunk(
  'analytics/fetchRestaurantRevenue',
  async ({ id, from = '', to = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      // Try primary route first, then fallback to restaurant subroute if needed
      try {
        const res = await api.get(`/analytics/restaurants/${id}/revenue?${params.toString()}`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 501 || err.response?.status === 404) {
          const fallback = await api.get(`/restaurants/${id}/revenue?${params.toString()}`);
          return fallback.data;
        }
        throw err;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Revenue analytics not available');
    }
  }
);

export const fetchTopDishes = createAsyncThunk(
  'analytics/fetchTopDishes',
  async ({ id, limit = 5 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/restaurants/${id}/top-dishes?limit=${limit}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Top dishes analytics not available');
    }
  }
);

export const fetchPeakHours = createAsyncThunk(
  'analytics/fetchPeakHours',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/restaurants/${id}/peak-hours`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Peak hours analytics not available');
    }
  }
);

export const fetchStatusBreakdown = createAsyncThunk(
  'analytics/fetchStatusBreakdown',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/restaurants/${id}/status-breakdown`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Status breakdown not available');
    }
  }
);

export const fetchTopCustomers = createAsyncThunk(
  'analytics/fetchTopCustomers',
  async (id, { rejectWithValue }) => {
    try {
      try {
        const res = await api.get(`/analytics/restaurants/${id}/top-customers`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 501 || err.response?.status === 404) {
          const fallback = await api.get(`/restaurants/${id}/top-customers`);
          return fallback.data;
        }
        throw err;
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Top customers analytics not available');
    }
  }
);

export const fetchRatings = createAsyncThunk(
  'analytics/fetchRatings',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analytics/restaurants/${id}/ratings`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Ratings summary not available');
    }
  }
);

export const fetchCityRevenue = createAsyncThunk(
  'analytics/fetchCityRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/platform/city-revenue');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'City revenue analytics not available');
    }
  }
);

export const fetchMonthlyTrend = createAsyncThunk(
  'analytics/fetchMonthlyTrend',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics/platform/monthly-trend');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Monthly trend analytics not available');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    revenue: null,
    topDishes: null,
    peakHours: null,
    statusBreakdown: null,
    topCustomers: null,
    ratings: null,
    cityRevenue: null,
    monthlyTrend: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetAnalytics: (state) => {
      state.revenue = null;
      state.topDishes = null;
      state.peakHours = null;
      state.statusBreakdown = null;
      state.topCustomers = null;
      state.ratings = null;
      state.cityRevenue = null;
      state.monthlyTrend = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantRevenue.fulfilled, (state, action) => {
        state.revenue = action.payload;
      })
      .addCase(fetchTopDishes.fulfilled, (state, action) => {
        state.topDishes = action.payload;
      })
      .addCase(fetchPeakHours.fulfilled, (state, action) => {
        state.peakHours = action.payload;
      })
      .addCase(fetchStatusBreakdown.fulfilled, (state, action) => {
        state.statusBreakdown = action.payload;
      })
      .addCase(fetchTopCustomers.fulfilled, (state, action) => {
        state.topCustomers = action.payload;
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.ratings = action.payload;
      })
      .addCase(fetchCityRevenue.fulfilled, (state, action) => {
        state.cityRevenue = action.payload;
      })
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.monthlyTrend = action.payload;
      });
  },
});

export const { resetAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
