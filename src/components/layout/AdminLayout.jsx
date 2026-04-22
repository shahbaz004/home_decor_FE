import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  BarChart3, Star, ChevronLeft, ChevronRight, Bell, Home,
  Settings, LogOut, Menu,
} from 'lucide-react';
import { selectCurrentUser } from '@/store/slices/authSlice.js';
import { useAuth } from '@/hooks/useAuth.js';
import { cn } from '@/utils/cn.js';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Coupons', to: '/admin/coupons', icon: Tag },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  { label: 'Reviews', to: '/admin/reviews', icon: Star },
];

function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const user = useSelector(selectCurrentUser);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to) => {
    if (to === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(to);
  };

  const NavItem = ({ item }) => (
    <Link
      to={item.to}
      onClick={() => setMobileOpen(false)}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
        isActive(item.to)
          ? 'bg-primary-600 text-white shadow-warm'
          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className={cn('w-5 h-5 flex-shrink-0', collapsed ? 'mx-auto' : '')} />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 bg-neutral-900 flex flex-col transition-all duration-300',
          collapsed ? 'w-16' : 'w-60',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-neutral-800 flex-shrink-0">
          {!collapsed && (
            <Link to="/admin" className="font-display text-lg font-bold text-white">
              Artisan<span className="text-primary-400">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              'p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden lg:flex',
              collapsed && 'mx-auto'
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all"
            title={collapsed ? 'View Store' : undefined}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {!collapsed && 'View Store'}
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-red-900/30 hover:text-red-400 w-full transition-all"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn('flex-1 flex flex-col transition-all duration-300', collapsed ? 'lg:ml-16' : 'lg:ml-60')}>
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-serif font-semibold text-neutral-800 hidden sm:block">
              {ADMIN_NAV.find((n) => isActive(n.to))?.label || 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-terracotta-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
                {user?.first_name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-neutral-800 leading-none">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
