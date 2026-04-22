import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout.jsx';
import AdminLayout from '@/components/layout/AdminLayout.jsx';
import PrivateRoute from '@/components/guards/PrivateRoute.jsx';
import AdminRoute from '@/components/guards/AdminRoute.jsx';

// Public pages
import HomePage from '@/pages/HomePage.jsx';
import ProductListPage from '@/pages/ProductListPage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import CartPage from '@/pages/CartPage.jsx';
import WishlistPage from '@/pages/WishlistPage.jsx';
import SearchPage from '@/pages/SearchPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import FaqPage from '@/pages/FaqPage.jsx';
import PrivacyPage from '@/pages/PrivacyPage.jsx';
import TermsPage from '@/pages/TermsPage.jsx';

// Auth pages
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from '@/pages/ResetPasswordPage.jsx';
import GoogleCallbackPage from '@/pages/GoogleCallbackPage.jsx';

// Protected pages
import CheckoutPage from '@/pages/CheckoutPage.jsx';
import OrderSuccessPage from '@/pages/OrderSuccessPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import OrderDetailPage from '@/pages/OrderDetailPage.jsx';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import AdminProducts from '@/pages/admin/AdminProducts.jsx';
import AdminOrders from '@/pages/admin/AdminOrders.jsx';
import AdminCustomers from '@/pages/admin/AdminCustomers.jsx';
import AdminCoupons from '@/pages/admin/AdminCoupons.jsx';
import AdminAnalytics from '@/pages/admin/AdminAnalytics.jsx';
import AdminReviews from '@/pages/admin/AdminReviews.jsx';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<OrderSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/orders" element={<ProfilePage tab="orders" />} />
          <Route path="/profile/orders/:id" element={<OrderDetailPage />} />
          <Route path="/profile/addresses" element={<ProfilePage tab="addresses" />} />
          <Route path="/profile/wishlist" element={<ProfilePage tab="wishlist" />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProducts mode="create" />} />
          <Route path="/admin/products/:id/edit" element={<AdminProducts mode="edit" />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrders mode="detail" />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
