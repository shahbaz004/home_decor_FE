import axios from 'axios';
import { updateAccessToken, clearCredentials } from '@/store/slices/authSlice.js';

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export const axiosBaseQuery =
  ({ baseUrl = '/v1' } = {}) =>
  async ({ url, method = 'GET', data, params, headers = {} }, { getState, dispatch }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const result = await axiosInstance({
        url: `${baseUrl}${url}`,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;

      // 401 -> attempt token refresh
      if (err.response?.status === 401) {
        const refreshToken = getState().auth.refreshToken;
        if (refreshToken) {
          try {
            const refreshResult = await axiosInstance.post('/auth/token/refresh/', {
              refresh: refreshToken,
            });
            const newAccessToken = refreshResult.data.access;
            dispatch(updateAccessToken(newAccessToken));

            // Retry original request with new token
            const retryResult = await axiosInstance({
              url: `${baseUrl}${url}`,
              method,
              data,
              params,
              headers: { ...headers, Authorization: `Bearer ${newAccessToken}` },
            });
            return { data: retryResult.data };
          } catch {
            dispatch(clearCredentials());
            return {
              error: {
                status: 401,
                data: 'Session expired. Please log in again.',
              },
            };
          }
        } else {
          dispatch(clearCredentials());
        }
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
