import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { X, Home, Package, Heart, User, Settings, LogOut, ShoppingCart, Info, Phone } from 'lucide-react';
import { selectMobileMenuOpen, setMobileMenuOpen } from '@/store/slices/uiSlice.js';
import { useAuth } from '@/hooks/useAuth.js';
import { cn } from '@/utils/cn.js';

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Shop', to: '/products', icon: Package },
  { label: 'Wishlist', to: '/wishlist', icon: Heart },
  { label: 'Cart', to: '/cart', icon: ShoppingCart },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: Phone },
];

function Sidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const isOpen = useSelector(selectMobileMenuOpen);

  const close = () => dispatch(setMobileMenuOpen(false));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-xl flex flex-col lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <Link to="/" onClick={close} className="font-display text-xl font-bold text-neutral-800">
                Artisan<span className="text-primary-600">Home</span>
              </Link>
              <button
                onClick={close}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            {isAuthenticated && user && (
              <div className="px-5 py-4 bg-primary-50 border-b border-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold">
                    {user.first_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-800">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={close}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium mb-1 transition-all duration-200',
                    location.pathname === to
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  <div className="h-px bg-neutral-100 my-3" />
                  <Link to="/profile" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 mb-1">
                    <User className="w-5 h-5" /> My Profile
                  </Link>
                  {(user?.is_staff || user?.role === 'admin') && (
                    <Link to="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 mb-1">
                      <Settings className="w-5 h-5" /> Admin
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-neutral-100">
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); close(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={close} className="flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm">
                    Login
                  </Link>
                  <Link to="/register" onClick={close} className="flex items-center justify-center gap-2 py-2.5 border-2 border-primary-600 text-primary-600 rounded-lg font-medium text-sm">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
