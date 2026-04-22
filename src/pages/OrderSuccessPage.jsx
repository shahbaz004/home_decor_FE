import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Download } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useGetOrderQuery } from '@/api/apiSlice.js';
import { clearCart } from '@/store/slices/cartSlice.js';
import { formatPrice, formatDate } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import { StatusBadge } from '@/components/ui/Badge.jsx';

function OrderSuccessPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const { data: order } = useGetOrderQuery(orderId, { skip: !orderId });

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="bg-white rounded-3xl shadow-warm-lg overflow-hidden"
        >
          {/* Success Header */}
          <div className="bg-green-50 px-8 py-10 text-center border-b border-green-100">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-neutral-800 mb-2">
              Order Confirmed! 🎉
            </h1>
            <p className="text-neutral-500 text-sm">
              Thank you for shopping with ArtisanHome
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {order ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-neutral-400">Order Number</p>
                    <p className="font-bold text-neutral-800 font-mono text-lg">#{order.order_number || orderId}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
                  <div>
                    <p className="text-neutral-400 text-xs">Order Date</p>
                    <p className="text-neutral-800 font-medium mt-0.5">{formatDate(order.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs">Total Amount</p>
                    <p className="text-neutral-800 font-bold mt-0.5">{formatPrice(order.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs">Payment</p>
                    <p className="text-neutral-800 font-medium mt-0.5 capitalize">{order.payment_method?.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-neutral-400 text-xs">Delivery</p>
                    <p className="text-neutral-800 font-medium mt-0.5">{order.shipping_method || 'Standard'}</p>
                  </div>
                </div>

                {/* Items Preview */}
                {order.items?.length > 0 && (
                  <div className="bg-neutral-50 rounded-xl p-4 mb-5">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Items Ordered</p>
                    <div className="space-y-2">
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-200 flex-shrink-0 overflow-hidden">
                            {item.product?.image && (
                              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-neutral-800 truncate">{item.product?.name || item.name}</p>
                            <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : orderId ? (
              <div className="text-center py-4">
                <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Order #{orderId} confirmed!</p>
              </div>
            ) : null}

            {/* Estimated Delivery */}
            <div className="bg-primary-50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Package className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-primary-800">Estimated Delivery</p>
                <p className="text-xs text-primary-600">5-7 business days from today</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {orderId && (
                <Link to={`/profile/orders/${orderId}`}>
                  <Button fullWidth variant="outline" leftIcon={<Package className="w-4 h-4" />}>
                    Track Order
                  </Button>
                </Link>
              )}
              <Link to="/products">
                <Button fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-sm text-neutral-500 mt-4">
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
