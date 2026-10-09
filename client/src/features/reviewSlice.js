import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ orderId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post('/reviews', { orderId, rating, comment });
      return response.data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const fetchRestaurantReviews = createAsyncThunk(
  'reviews/fetchRestaurantReviews',
  async ({ restaurantId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}/reviews?page=${page}&limit=${limit}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // createReview
      .addCase(createReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
      })
      // fetchRestaurantReviews
      .addCase(fetchRestaurantReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRestaurantReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchRestaurantReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
