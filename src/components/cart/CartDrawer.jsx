import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartDrawerOpen, setCartDrawerOpen } from '@/store/slices/uiSlice.js';
import { selectCartItems, selectCartTotal, selectCartItemCount } from '@/store/slices/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import CartItem from './CartItem.jsx';

function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(selectCartDrawerOpen);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const drawerRef = useRef(null);

  const close = () => dispatch(setCartDrawerOpen(false));

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCheckout = () => {
    close();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-serif font-semibold text-neutral-800 text-lg">
                  Shopping Cart
                </h2>
                {itemCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={close}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <Package className="w-10 h-10 text-neutral-300" />
                  </div>
                  <h3 className="font-serif font-semibold text-neutral-700 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-neutral-400 mb-6">
                    Discover our beautiful collection of home decor.
                  </p>
                  <Button onClick={close} variant="outline" size="sm">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <AnimatePresence>
                    {items.map((item) => (
                      <CartItem key={item.id || item.productId} item={item} compact />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-5 flex-shrink-0 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-neutral-600 font-medium">Subtotal</span>
                  <span className="text-xl font-bold font-serif text-neutral-800">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 mb-4 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                <div className="flex flex-col gap-2.5">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleCheckout}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    size="lg"
                  >
                    Checkout
                  </Button>
                  <Link to="/cart" onClick={close}>
                    <Button variant="outline" fullWidth size="md">
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
