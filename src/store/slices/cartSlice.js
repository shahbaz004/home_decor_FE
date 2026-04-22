import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  coupon: null,
  discount: 0,
  shippingCost: 0,
  grandTotal: 0,
};

function recalculate(state) {
  state.itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  state.total = state.items.reduce(
    (acc, item) => acc + (item.salePrice || item.price) * item.quantity,
    0
  );
  state.discount = state.coupon
    ? state.coupon.discountType === 'percentage'
      ? (state.total * state.coupon.discountValue) / 100
      : state.coupon.discountValue
    : 0;
  state.grandTotal = Math.max(0, state.total - state.discount + state.shippingCost);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      const { items, coupon, shippingCost } = action.payload;
      state.items = items || [];
      state.coupon = coupon || null;
      state.shippingCost = shippingCost || 0;
      recalculate(state);
    },
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
      recalculate(state);
    },
    updateItem: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find((i) => i.id === itemId || i.productId === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== itemId && i.productId !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
      recalculate(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (i) => i.id !== action.payload && i.productId !== action.payload
      );
      recalculate(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      recalculate(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      recalculate(state);
    },
    setShipping: (state, action) => {
      state.shippingCost = action.payload;
      recalculate(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.coupon = null;
      state.discount = 0;
      state.shippingCost = 0;
      state.grandTotal = 0;
    },
  },
});

export const { setCart, addItem, updateItem, removeItem, applyCoupon, removeCoupon, setShipping, clearCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartCoupon = (state) => state.cart.coupon;
export const selectCartDiscount = (state) => state.cart.discount;
export const selectCartGrandTotal = (state) => state.cart.grandTotal;
export const selectShippingCost = (state) => state.cart.shippingCost;

export default cartSlice.reducer;
