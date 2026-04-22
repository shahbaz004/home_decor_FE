import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCartItems, selectCartTotal, selectCartCoupon } from '@/store/slices/cartSlice.js';
import CheckoutStepper from '@/components/checkout/CheckoutStepper.jsx';
import AddressStep from '@/components/checkout/AddressStep.jsx';
import ShippingStep from '@/components/checkout/ShippingStep.jsx';
import OrderReview from '@/components/checkout/OrderReview.jsx';
import PaymentStep from '@/components/checkout/PaymentStep.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';
import { formatPrice } from '@/utils/formatters.js';

function CheckoutPage() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const coupon = useSelector(selectCartCoupon);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]}
          className="mb-6"
        />

        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-8 text-center">
          Checkout
        </h1>

        {/* Stepper */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <CheckoutStepper currentStep={currentStep} />
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {currentStep === 1 && (
            <AddressStep
              selectedAddress={selectedAddress}
              onSelect={setSelectedAddress}
              onNext={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 2 && (
            <ShippingStep
              selectedMethod={selectedShipping}
              onSelect={setSelectedShipping}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
              cartTotal={cartTotal}
            />
          )}
          {currentStep === 3 && (
            <OrderReview
              address={selectedAddress}
              shippingMethod={selectedShipping}
              onNext={() => setCurrentStep(4)}
              onBack={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <PaymentStep
              selectedAddress={selectedAddress}
              selectedShipping={selectedShipping}
              coupon={coupon}
              onBack={() => setCurrentStep(3)}
            />
          )}
        </div>

        {/* Cart Summary Sidebar */}
        <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-neutral-700 text-sm mb-3">Order Summary ({cartItems.length} items)</h3>
          <div className="space-y-2">
            {cartItems.slice(0, 3).map((item) => (
              <div key={item.id || item.productId} className="flex items-center gap-3">
                <img
                  src={item.image || `https://picsum.photos/seed/${item.productId}/50/50`}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-neutral-800 line-clamp-1">{item.name}</p>
                  <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-semibold text-neutral-800">
                  {formatPrice((item.salePrice || item.price) * item.quantity)}
                </p>
              </div>
            ))}
            {cartItems.length > 3 && (
              <p className="text-xs text-neutral-400">+{cartItems.length - 3} more items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
