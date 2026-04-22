import { useParams, Link } from 'react-router-dom';
import { Package, MapPin, Truck, CreditCard, Download, ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useGetOrderQuery, useCancelOrderMutation } from '@/api/apiSlice.js';
import { formatPrice, formatDate, formatOrderStatus } from '@/utils/formatters.js';
import { StatusBadge } from '@/components/ui/Badge.jsx';
import Button from '@/components/ui/Button.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';
import { PageSpinner } from '@/components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const ORDER_TIMELINE = [
  { status: 'pending', label: 'Order Placed', icon: Package },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'processing', label: 'Processing', icon: Clock },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function OrderDetailPage() {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (isLoading) return <PageSpinner />;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-3">Order not found</h2>
          <Link to="/profile/orders" className="text-primary-600 hover:underline">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(id).unwrap();
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to cancel order');
    }
  };

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: 'Profile', href: '/profile' },
            { label: 'Orders', href: '/profile/orders' },
            { label: `Order #${order.order_number || id}` },
          ]}
          className="mb-6"
        />

        <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-neutral-800">
              Order #{order.order_number || id}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">Placed on {formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                isLoading={isCancelling}
                leftIcon={<XCircle className="w-4 h-4" />}
              >
                Cancel Order
              </Button>
            )}
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Invoice
            </Button>
          </div>
        </div>

        {/* Order Timeline */}
        {order.status !== 'cancelled' && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-semibold text-neutral-800 mb-6">Order Status</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-neutral-100">
                <div
                  className="h-full bg-primary-500 transition-all duration-500"
                  style={{ width: `${(currentStatusIndex / (ORDER_TIMELINE.length - 1)) * 100}%` }}
                />
              </div>
              {ORDER_TIMELINE.map((step, i) => {
                const isCompleted = i <= currentStatusIndex;
                const Icon = step.icon;
                return (
                  <div key={step.status} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white transition-all ${
                      isCompleted ? 'border-primary-500 bg-primary-500' : 'border-neutral-200'
                    }`}>
                      <Icon className={`w-5 h-5 ${isCompleted ? 'text-white' : 'text-neutral-300'}`} />
                    </div>
                    <p className={`text-xs font-medium mt-2 text-center hidden sm:block ${isCompleted ? 'text-primary-600' : 'text-neutral-400'}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-800">Items Ordered</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-50 flex-shrink-0">
                    <img
                      src={item.product?.image || `https://picsum.photos/seed/${i}/80/80`}
                      alt={item.product?.name || item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-800 text-sm">{item.product?.name || item.name}</p>
                    {item.variant && (
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-neutral-800 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Payment & Delivery */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              {order.address && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary-600" /> Delivery Address
                  </h3>
                  <p className="text-sm text-neutral-600">{order.address.full_name}</p>
                  <p className="text-sm text-neutral-600">{order.address.address_line1}</p>
                  <p className="text-sm text-neutral-600">{order.address.city}, {order.address.state}</p>
                </div>
              )}
              <div className="border-t border-neutral-100 pt-4">
                <h3 className="text-sm font-semibold text-neutral-700 flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-primary-600" /> Payment
                </h3>
                <p className="text-sm text-neutral-600 capitalize">{order.payment_method?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {order.payment_status === 'paid' ? '✓ Paid' : order.payment_status}
                </p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-neutral-800 mb-3">Price Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="border-t border-neutral-100 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary-700">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/profile/orders">
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
