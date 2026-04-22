import { MapPin, Truck, Tag } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartDiscount,
  selectCartGrandTotal,
  selectShippingCost,
  selectCartCoupon,
} from '@/store/slices/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';

function OrderReview({ address, shippingMethod, onNext, onBack }) {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const discount = useSelector(selectCartDiscount);
  const grandTotal = useSelector(selectCartGrandTotal);
  const shippingCost = useSelector(selectShippingCost);
  const coupon = useSelector(selectCartCoupon);

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-neutral-800 mb-5">Review Your Order</h2>

      {/* Items */}
      <div className="bg-neutral-50 rounded-xl overflow-hidden mb-4">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-800 text-sm">Order Items ({items.length})</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {items.map((item) => (
            <div key={item.id || item.productId} className="flex items-center gap-3 p-4">
              <img
                src={item.image || `https://picsum.photos/seed/${item.productId}/80/80`}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                {item.variant && (
                  <p className="text-xs text-neutral-500">
                    {Object.entries(item.variant).map(([k, v]) => `${k}: ${v}`).join(', ')}
                  </p>
                )}
                <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-neutral-800 flex-shrink-0">
                {formatPrice((item.salePrice || item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        {address && (
          <div className="bg-neutral-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <h3 className="font-semibold text-neutral-800 text-sm">Delivery Address</h3>
            </div>
            <p className="text-sm text-neutral-600">{address.full_name}</p>
            <p className="text-sm text-neutral-600">{address.address_line1}</p>
            <p className="text-sm text-neutral-600">{address.city}, {address.state} - {address.postal_code}</p>
            <p className="text-sm text-neutral-500">+91 {address.phone}</p>
          </div>
        )}

        {shippingMethod && (
          <div className="bg-neutral-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-primary-600" />
              <h3 className="font-semibold text-neutral-800 text-sm">Shipping Method</h3>
            </div>
            <p className="text-sm font-medium text-neutral-800">{shippingMethod.name}</p>
            <p className="text-sm text-neutral-500">{shippingMethod.description}</p>
            <p className="text-sm font-semibold text-primary-600 mt-1">
              {shippingMethod.price === 0 ? 'FREE' : formatPrice(shippingMethod.price)}
            </p>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-6">
        <h3 className="font-semibold text-neutral-800 mb-3">Price Summary</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Subtotal ({items.length} items)</span>
            <span className="text-neutral-800">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Shipping</span>
            <span className={shippingCost === 0 ? 'text-green-600 font-medium' : 'text-neutral-800'}>
              {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Coupon ({coupon?.code})
              </span>
              <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="h-px bg-neutral-100 my-2" />
          <div className="flex justify-between text-base font-bold">
            <span className="text-neutral-800">Total Amount</span>
            <span className="text-primary-700 font-serif text-xl">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>← Back</Button>
        <Button onClick={onNext} size="lg">Proceed to Payment →</Button>
      </div>
    </div>
  );
}

export default OrderReview;
