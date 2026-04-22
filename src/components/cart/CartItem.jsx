import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/utils/formatters.js';
import { useCart } from '@/hooks/useCart.js';
import { cn } from '@/utils/cn.js';

function CartItem({ item, compact = false }) {
  const { updateQuantity, removeFromCart, isUpdating, isRemoving } = useCart();

  const itemPrice = item.salePrice || item.price;
  const lineTotal = itemPrice * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        'flex gap-3 bg-white rounded-xl',
        compact ? 'p-3' : 'p-4 border border-neutral-100'
      )}
    >
      {/* Product Image */}
      <Link to={`/products/${item.slug}`} className="flex-shrink-0">
        <img
          src={item.image || `https://picsum.photos/seed/${item.productId}/100/100`}
          alt={item.name}
          className={cn('rounded-lg object-cover', compact ? 'w-16 h-16' : 'w-20 h-20')}
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.slug}`}>
          <h4 className={cn(
            'font-medium text-neutral-800 hover:text-primary-600 transition-colors line-clamp-2',
            compact ? 'text-sm' : 'text-base'
          )}>
            {item.name}
          </h4>
        </Link>

        {/* Variant */}
        {item.variant && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(item.variant).map(([key, val]) => (
              <span key={key} className="text-xs text-neutral-500 capitalize">
                {key}: <span className="text-neutral-700">{val}</span>
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <span className={cn('font-semibold text-neutral-800', compact ? 'text-sm' : 'text-base')}>
            {formatPrice(itemPrice)}
          </span>
          {item.salePrice && item.price > item.salePrice && (
            <span className="text-xs text-neutral-400 line-through">{formatPrice(item.price)}</span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => updateQuantity(item.id || item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-neutral-800">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id || item.productId, item.quantity + 1)}
              disabled={isUpdating}
              className="w-7 h-7 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!compact && (
              <span className="text-sm font-semibold text-primary-700">
                {formatPrice(lineTotal)}
              </span>
            )}
            <button
              onClick={() => removeFromCart(item.id || item.productId)}
              disabled={isRemoving}
              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CartItem;
