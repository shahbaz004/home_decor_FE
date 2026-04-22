import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { cn } from '@/utils/cn.js';
import { formatPrice } from '@/utils/formatters.js';
import { selectIsAuthenticated } from '@/store/slices/authSlice.js';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/api/apiSlice.js';
import { useCart } from '@/hooks/useCart.js';
import Badge from '@/components/ui/Badge.jsx';

function ProductCard({ product, className }) {
  const [isWishlisted, setIsWishlisted] = useState(product?.is_wishlisted || false);
  const [imageError, setImageError] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { addToCart, isAdding } = useCart();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (!product) return null;

  const {
    id, name, slug, price, sale_price: salePrice, images, category,
    rating, review_count: reviewCount, stock, is_featured: isFeatured,
  } = product;

  const primaryImage = images?.[0]?.url || images?.[0] || `https://picsum.photos/seed/${id}/400/400`;
  const secondaryImage = images?.[1]?.url || images?.[1];
  const discountPercent = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const inStock = stock > 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await removeFromWishlist(id).unwrap();
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist({ product: id }).unwrap();
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    await addToCart(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn('group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-warm-lg transition-shadow duration-300', className)}
    >
      <Link to={`/products/${slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-neutral-50">
          <img
            src={imageError ? `https://picsum.photos/seed/${id}/400/400` : primaryImage}
            alt={name}
            onError={() => setImageError(true)}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              secondaryImage && 'group-hover:opacity-0'
            )}
            loading="lazy"
          />
          {secondaryImage && !imageError && (
            <img
              src={secondaryImage}
              alt={`${name} alternate`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isFeatured && (
              <Badge variant="terracotta" size="sm">Featured</Badge>
            )}
            {discountPercent > 0 && (
              <Badge variant="error" size="sm">-{discountPercent}%</Badge>
            )}
            {!inStock && (
              <Badge variant="default" size="sm">Out of Stock</Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              className={cn(
                'w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-colors',
                isWishlisted
                  ? 'bg-red-50 text-red-500 border border-red-200'
                  : 'bg-white text-neutral-500 hover:text-red-500 border border-neutral-200'
              )}
              aria-label="Add to wishlist"
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-red-500')} />
            </motion.button>

            <Link
              to={`/products/${slug}`}
              className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-500 hover:text-primary-600 border border-neutral-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
              aria-label="View product"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Add to Cart - hover overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAdding}
              className={cn(
                'w-full py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                inStock
                  ? 'bg-neutral-900 hover:bg-primary-700 text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {category && (
            <p className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1.5">
              {typeof category === 'object' ? category.name : category}
            </p>
          )}

          <h3 className="font-medium text-neutral-800 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-3 h-3',
                      star <= Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-400">({reviewCount || 0})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-neutral-800">
              {formatPrice(salePrice || price)}
            </span>
            {salePrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
