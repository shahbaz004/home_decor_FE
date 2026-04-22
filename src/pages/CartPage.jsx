import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Tag, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  selectCartItems, selectCartTotal, selectCartGrandTotal,
  selectCartDiscount, selectShippingCost, selectCartCoupon,
} from '@/store/slices/cartSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { useCart } from '@/hooks/useCart.js';
import CartItem from '@/components/cart/CartItem.jsx';
import Button from '@/components/ui/Button.jsx';
import Input from '@/components/ui/Input.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';

function CartPage() {
  const navigate = useNavigate();
  const { applyCartCoupon, removeCartCoupon, isValidatingCoupon } = useCart();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const grandTotal = useSelector(selectCartGrandTotal);
  const discount = useSelector(selectCartDiscount);
  const shippingCost = useSelector(selectShippingCost);
  const coupon = useSelector(selectCartCoupon);

  const [couponCode, setCouponCode] = useState('');

  const handleCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await applyCartCoupon(couponCode.trim().toUpperCase());
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <Package className="w-12 h-12 text-neutral-300" />
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-3">Your cart is empty</h1>
          <p className="text-neutral-500 mb-8">
            Looks like you haven't added any items yet. Explore our beautiful collection!
          </p>
          <Button size="lg" onClick={() => navigate('/products')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Cart' }]} className="mb-6" />
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-sm text-neutral-500">{items.length} item{items.length !== 1 ? 's' : ''}</span>
              <span className="text-sm text-neutral-500">Price</span>
            </div>
            <AnimatePresence>
              {items.map((item) => (
                <CartItem key={item.id || item.productId} item={item} />
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <Link to="/products" className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 sticky top-24">
              <h2 className="font-serif font-bold text-neutral-800 text-lg mb-5">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                <p className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-primary-600" />
                  Promo Code
                </p>
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-green-700">{coupon.code}</p>
                      <p className="text-xs text-green-600">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}% off`
                          : `₹${coupon.discountValue} off`}
                      </p>
                    </div>
                    <button
                      onClick={removeCartCoupon}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCoupon} className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 uppercase"
                    />
                    <Button type="submit" size="sm" isLoading={isValidatingCoupon}>
                      Apply
                    </Button>
                  </form>
                )}
              </div>

              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="text-neutral-800">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : 'text-neutral-800'}>
                    {shippingCost === 0 ? 'Calculated at checkout' : formatPrice(shippingCost)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({coupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {total >= 2000 && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    Free shipping applied!
                  </p>
                )}
                <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-neutral-800">Total</span>
                  <span className="text-2xl font-bold font-serif text-primary-700">
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                className="mt-5"
                onClick={() => navigate('/checkout')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>

              {/* Trust badges */}
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-400">
                <span>🔒 Secure Checkout</span>
                <span>·</span>
                <span>30-day returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
