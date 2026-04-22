import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  selectCartCoupon,
  selectCartGrandTotal,
  selectCartDiscount,
  selectShippingCost,
  addItem,
  updateItem,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart,
} from '@/store/slices/cartSlice.js';
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useValidateCouponMutation,
} from '@/api/apiSlice.js';
import { useSelector as useAppSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/slices/authSlice.js';

export function useCart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const coupon = useSelector(selectCartCoupon);
  const grandTotal = useSelector(selectCartGrandTotal);
  const discount = useSelector(selectCartDiscount);
  const shippingCost = useSelector(selectShippingCost);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [addToCartApi, { isLoading: isAdding }] = useAddToCartMutation();
  const [updateCartItemApi, { isLoading: isUpdating }] = useUpdateCartItemMutation();
  const [removeCartItemApi, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const [validateCouponApi, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();

  const addToCart = async (product, variant = null, quantity = 1) => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images?.[0]?.url || product.image,
      slug: product.slug,
      variant,
      quantity,
    };

    if (isAuthenticated) {
      try {
        await addToCartApi({ product: product.id, variant, quantity }).unwrap();
        toast.success(`${product.name} added to cart`);
      } catch (err) {
        toast.error(err?.data?.detail || 'Failed to add to cart');
        return;
      }
    }

    dispatch(addItem(cartItem));
    if (!isAuthenticated) toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = async (itemId, quantity) => {
    if (isAuthenticated) {
      try {
        await updateCartItemApi({ itemId, quantity }).unwrap();
      } catch (err) {
        toast.error(err?.data?.detail || 'Failed to update cart');
        return;
      }
    }
    dispatch(updateItem({ itemId, quantity }));
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await removeCartItemApi(itemId).unwrap();
      } catch (err) {
        toast.error(err?.data?.detail || 'Failed to remove item');
        return;
      }
    }
    dispatch(removeItem(itemId));
    toast.success('Item removed from cart');
  };

  const applyCartCoupon = async (code) => {
    try {
      const result = await validateCouponApi({ code, cartTotal: total }).unwrap();
      dispatch(applyCoupon(result.coupon));
      toast.success(`Coupon "${code}" applied! You save ${result.coupon.discountValue}`);
      return { success: true };
    } catch (err) {
      const message = err?.data?.detail || 'Invalid coupon code';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const removeCartCoupon = () => {
    dispatch(removeCoupon());
    toast.success('Coupon removed');
  };

  const emptyCart = () => {
    dispatch(clearCart());
  };

  return {
    items,
    total,
    itemCount,
    coupon,
    grandTotal,
    discount,
    shippingCost,
    isAdding,
    isUpdating,
    isRemoving,
    isValidatingCoupon,
    addToCart,
    updateQuantity,
    removeFromCart,
    applyCartCoupon,
    removeCartCoupon,
    emptyCart,
  };
}

export default useCart;
