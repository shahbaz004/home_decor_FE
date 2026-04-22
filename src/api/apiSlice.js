import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './baseQuery.js';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Product', 'Category', 'Cart', 'Wishlist', 'Order',
    'Review', 'Address', 'Coupon', 'Customer', 'AdminStats',
  ],
  endpoints: (builder) => ({
    // ─── AUTH ──────────────────────────────────────────────
    register: builder.mutation({
      query: (data) => ({ url: '/auth/register/', method: 'POST', data }),
    }),
    login: builder.mutation({
      query: (data) => ({ url: '/auth/login/', method: 'POST', data }),
    }),
    logout: builder.mutation({
      query: (data) => ({ url: '/auth/logout/', method: 'POST', data }),
    }),
    googleLogin: builder.mutation({
      query: (data) => ({ url: '/auth/google/', method: 'POST', data }),
    }),
    getProfile: builder.query({
      query: () => ({ url: '/auth/profile/' }),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/auth/profile/', method: 'PATCH', data }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/auth/change-password/', method: 'POST', data }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({ url: '/auth/forgot-password/', method: 'POST', data }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({ url: '/auth/reset-password/', method: 'POST', data }),
    }),

    // ─── PRODUCTS ──────────────────────────────────────────
    getProducts: builder.query({
      query: (params) => ({ url: '/products/', params }),
      providesTags: (result) =>
        result
          ? [...result.results.map(({ id }) => ({ type: 'Product', id })), 'Product']
          : ['Product'],
    }),
    getProduct: builder.query({
      query: (slug) => ({ url: `/products/${slug}/` }),
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getFeaturedProducts: builder.query({
      query: () => ({ url: '/products/featured/' }),
      providesTags: ['Product'],
    }),
    getCategories: builder.query({
      query: () => ({ url: '/products/categories/' }),
      providesTags: ['Category'],
    }),
    getCategory: builder.query({
      query: (slug) => ({ url: `/products/categories/${slug}/` }),
      providesTags: (result, error, slug) => [{ type: 'Category', id: slug }],
    }),

    // ─── CART ──────────────────────────────────────────────
    getCart: builder.query({
      query: () => ({ url: '/cart/' }),
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (data) => ({ url: '/cart/items/', method: 'POST', data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, ...data }) => ({ url: `/cart/items/${itemId}/`, method: 'PATCH', data }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({ url: `/cart/items/${itemId}/`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    mergeCart: builder.mutation({
      query: (data) => ({ url: '/cart/merge/', method: 'POST', data }),
      invalidatesTags: ['Cart'],
    }),

    // ─── WISHLIST ──────────────────────────────────────────
    getWishlist: builder.query({
      query: () => ({ url: '/wishlist/' }),
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: (data) => ({ url: '/wishlist/', method: 'POST', data }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/wishlist/${productId}/`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),

    // ─── ORDERS ────────────────────────────────────────────
    createOrder: builder.mutation({
      query: (data) => ({ url: '/orders/', method: 'POST', data }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    getOrders: builder.query({
      query: (params) => ({ url: '/orders/', params }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => ({ url: `/orders/${id}/` }),
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/cancel/`, method: 'POST' }),
      invalidatesTags: ['Order'],
    }),

    // ─── PAYMENTS ──────────────────────────────────────────
    createRazorpayOrder: builder.mutation({
      query: (data) => ({ url: '/payments/razorpay/create/', method: 'POST', data }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (data) => ({ url: '/payments/razorpay/verify/', method: 'POST', data }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    createStripeIntent: builder.mutation({
      query: (data) => ({ url: '/payments/stripe/create-intent/', method: 'POST', data }),
    }),

    // ─── COUPONS ───────────────────────────────────────────
    validateCoupon: builder.mutation({
      query: (data) => ({ url: '/coupons/validate/', method: 'POST', data }),
    }),

    // ─── REVIEWS ───────────────────────────────────────────
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => ({ url: '/reviews/', params: { product_id: productId, ...params } }),
      providesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: '/reviews/',
        method: 'POST',
        data: { product: productId, ...data },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Review', id: productId }],
    }),

    // ─── ADDRESSES ─────────────────────────────────────────
    getAddresses: builder.query({
      query: () => ({ url: '/addresses/' }),
      providesTags: ['Address'],
    }),
    createAddress: builder.mutation({
      query: (data) => ({ url: '/addresses/', method: 'POST', data }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/addresses/${id}/`, method: 'PUT', data }),
      invalidatesTags: ['Address'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/addresses/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Address'],
    }),

    // ─── ADMIN ─────────────────────────────────────────────
    getAdminStats: builder.query({
      query: () => ({ url: '/analytics/dashboard/' }),
      providesTags: ['AdminStats'],
    }),
    getSalesChart: builder.query({
      query: (params) => ({ url: '/analytics/sales-chart/', params }),
      providesTags: ['AdminStats'],
    }),
    getTopProducts: builder.query({
      query: (params) => ({ url: '/analytics/top-products/', params }),
      providesTags: ['AdminStats'],
    }),
    getAdminOrders: builder.query({
      query: (params) => ({ url: '/orders/', params }),
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/orders/${id}/update_status/`, method: 'PATCH', data }),
      invalidatesTags: ['Order'],
    }),
    getAdminProducts: builder.query({
      query: (params) => ({ url: '/products/', params }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (data) => ({ url: '/products/', method: 'POST', data }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/products/${id}/`, method: 'PUT', data }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
    getCustomers: builder.query({
      query: (params) => ({ url: '/auth/customers/', params }),
      providesTags: ['Customer'],
    }),
    getAdminCoupons: builder.query({
      query: (params) => ({ url: '/coupons/admin/', params }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({ url: '/coupons/admin/', method: 'POST', data }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/coupons/admin/${id}/`, method: 'PUT', data }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({ url: `/coupons/admin/${id}/`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
    getAdminReviews: builder.query({
      query: (params) => ({ url: '/reviews/', params }),
      providesTags: ['Review'],
    }),
    updateReviewStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reviews/${id}/${status === 'approved' ? 'approve' : 'reject'}/`,
        method: 'POST',
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProductsQuery,
  useGetProductQuery,
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useMergeCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCreateOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateStripeIntentMutation,
  useValidateCouponMutation,
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetAdminStatsQuery,
  useGetSalesChartQuery,
  useGetTopProductsQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCustomersQuery,
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
} = apiSlice;
