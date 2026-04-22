import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsLoading,
  clearCredentials,
  setCredentials,
} from '@/store/slices/authSlice.js';
import { useLoginMutation, useLogoutMutation } from '@/api/apiSlice.js';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const isAdmin = user?.role === 'admin' || user?.is_staff === true || user?.is_superuser === true;
  const isStaff = user?.role === 'staff' || user?.is_staff === true;

  const login = async (credentials) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.access,
          refreshToken: result.refresh,
        })
      );
      toast.success(`Welcome back, ${result.user?.first_name || 'there'}!`);
      return { success: true };
    } catch (error) {
      const message = error?.data?.detail || error?.data?.non_field_errors?.[0] || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logoutMutation({ refresh: refreshToken });
      }
    } catch {
      // Ignore logout API errors
    } finally {
      dispatch(clearCredentials());
      navigate('/');
      toast.success('Logged out successfully');
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    isStaff,
    isLoading,
    login,
    logout,
  };
}

export default useAuth;
