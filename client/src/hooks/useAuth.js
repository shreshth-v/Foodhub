import { useSelector, useDispatch } from 'react-redux';
import { loginUser, registerUser, logoutUser, fetchMe, clearAuthError } from '../features/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (credentials) => dispatch(loginUser(credentials));
  const register = (userData) => dispatch(registerUser(userData));
  const logout = () => dispatch(logoutUser());
  const loadUser = () => dispatch(fetchMe());
  const clearError = () => dispatch(clearAuthError());

  const isOwner = user?.role === 'owner';
  const isCustomer = user?.role === 'customer';

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isOwner,
    isCustomer,
    login,
    register,
    logout,
    loadUser,
    clearError,
  };
}
