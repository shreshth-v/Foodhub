import { useSelector, useDispatch } from 'react-redux';
import {
  fetchRestaurants,
  fetchRestaurantById,
  searchRestaurants,
  fetchNearbyRestaurants,
  setSelectedCity,
} from '../features/restaurantSlice';

export function useRestaurant() {
  const dispatch = useDispatch();
  const {
    list,
    total,
    page,
    totalPages,
    currentRestaurant,
    searchResults,
    nearbyRestaurants,
    loading,
    detailLoading,
    searchLoading,
    nearbyLoading,
    selectedCity,
  } = useSelector((state) => state.restaurants);

  return {
    restaurants: list,
    total,
    page,
    totalPages,
    currentRestaurant,
    searchResults,
    nearbyRestaurants,
    loading,
    detailLoading,
    searchLoading,
    nearbyLoading,
    selectedCity,
    setCity: (city) => dispatch(setSelectedCity(city)),
    loadRestaurants: (opts) => dispatch(fetchRestaurants(opts)),
    loadRestaurant: (id) => dispatch(fetchRestaurantById(id)),
    search: (params) => dispatch(searchRestaurants(params)),
    findNearby: (coords) => dispatch(fetchNearbyRestaurants(coords)),
  };
}
