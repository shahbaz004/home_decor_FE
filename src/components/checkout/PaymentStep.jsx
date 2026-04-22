import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Wallet, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectCartGrandTotal, selectCartItems } from '@/store/slices/cartSlice.js';
import { selectCurrentUser } from '@/store/slices/authSlice.js';
import { useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation, useCreateOrderMutation } from '@/api/apiSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'UPI / Cards / Net Banking', icon: Smartphone, description: 'Pay via Razorpay - UPI, debit/credit cards, net banking' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when you receive the order' },
];

function PaymentStep({ selectedAddress, selectedShipping, coupon, onBack }) {
  const navigate = useNavigate();
  const [method, setMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const grandTotal = useSelector(selectCartGrandTotal);
  const cartItems = useSelector(selectCartItems);
  const user = useSelector(selectCurrentUser);

  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyPayment] = useVerifyRazorpayPaymentMutation();
  const [createOrder] = useCreateOrderMutation();

  const handleRazorpay = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);
    try {
      // Create Razorpay order on backend
      const razorpayOrder = await createRazorpayOrder({
        amount: grandTotal,
        currency: 'INR',
      }).unwrap();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ArtisanHome',
        description: 'Home Decor Purchase',
        order_id: razorpayOrder.id,
        prefill: {
          name: `${user?.first_name} ${user?.last_name}`,
          email: user?.email,
          contact: selectedAddress?.phone,
        },
        theme: { color: '#d4812a' },
        handler: async (response) => {
          try {
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              address: selectedAddress?.id,
              shipping_method: selectedShipping?.id,
              coupon: coupon?.code,
            }).unwrap();

            toast.success('Payment successful!');
            navigate(`/checkout/success?order=${verifyResult.order_id}`);
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  const handleCOD = async () => {
    setIsProcessing(true);
    try {
      const result = await createOrder({
        items: cartItems.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        })),
        address: selectedAddress?.id,
        shipping_method: selectedShipping?.id,
        payment_method: 'cod',
        coupon: coupon?.code,
      }).unwrap();
      toast.success('Order placed successfully!');
      navigate(`/checkout/success?order=${result.id}`);
    } catch (err) {
      toast.error(err?.data?.detail || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = () => {
    if (method === 'razorpay') handleRazorpay();
    else handleCOD();
  };

  return (
    <div>
      <h2 className="text-xl font-serif font-bold text-neutral-800 mb-5">Payment</h2>

      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map((pm) => {
          const Icon = pm.icon;
          const isSelected = method === pm.id;
          return (
            <button
              key={pm.id}
              onClick={() => setMethod(pm.id)}
              className={cn(
                'w-full text-left p-4 rounded-xl border-2 transition-all',
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 bg-white'
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', isSelected ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-500')}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">{pm.label}</p>
                  <p className="text-xs text-neutral-500">{pm.description}</p>
                </div>
                <div className={cn('ml-auto w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0', isSelected ? 'border-primary-500' : 'border-neutral-300')}>
                  {isSelected && <div className="w-2 h-2 bg-primary-500 rounded-full" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Amount Summary */}
      <div className="bg-neutral-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600 font-medium">Total Amount</span>
          <span className="text-2xl font-bold font-serif text-neutral-800">{formatPrice(grandTotal)}</span>
        </div>
        {method === 'razorpay' && (
          <p className="text-xs text-neutral-400 mt-1">
            Secured by Razorpay. Your payment information is encrypted.
          </p>
        )}
        {method === 'cod' && (
          <p className="text-xs text-amber-600 mt-1">
            Cash on delivery available. Please keep exact change ready.
          </p>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6 p-3 bg-green-50 rounded-lg border border-green-100">
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-green-700">Your payment is 100% secure and encrypted</span>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} disabled={isProcessing}>← Back</Button>
        <Button
          onClick={handlePay}
          isLoading={isProcessing}
          size="lg"
          variant="warm"
          leftIcon={<CreditCard className="w-4 h-4" />}
        >
          {method === 'cod' ? 'Place Order' : `Pay ${formatPrice(grandTotal)}`}
        </Button>
      </div>
    </div>
  );
}

export default PaymentStep;
