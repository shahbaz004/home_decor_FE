import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '@/api/apiSlice.js';
import { useCart } from '@/hooks/useCart.js';
import { formatPrice } from '@/utils/formatters.js';
import Button from '@/components/ui/Button.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';
import { ProductGridSkeleton } from '@/components/ui/Skeleton.jsx';
import StarRating from '@/components/ui/StarRating.jsx';
import toast from 'react-hot-toast';

function WishlistPage() {
  const { data, isLoading } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState(null);

  const items = data?.data || data?.results || [];

  const handleRemove = async (itemId) => {
    setRemovingId(itemId);
    try {
      await removeFromWishlist(itemId).unwrap();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (item) => {
    await addToCart(item.product_detail || item);
    await handleRemove(item.id);
  };

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: 'Wishlist' }]} className="mb-6" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-neutral-800 flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <Link to="/products">
              <Button variant="outline" size="sm">Continue Shopping</Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-5">
              <Heart className="w-12 h-12 text-red-200" />
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-700 mb-3">Your wishlist is empty</h2>
            <p className="text-neutral-400 mb-8 max-w-xs">
              Save products you love and come back to them anytime.
            </p>
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Discover Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            <AnimatePresence>
              {items.map((item) => {
                const product = item.product_detail || item;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm group"
                  >
                    <Link to={`/products/${product.slug}`} className="block">
                      <div className="aspect-square overflow-hidden bg-neutral-50">
                        <img
                          src={product.primary_image?.image || product.images?.[0]?.image || product.images?.[0]?.url || `https://picsum.photos/seed/${product.id}/300/300`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-medium text-neutral-800 text-sm line-clamp-2 hover:text-primary-600 transition-colors mb-1.5">
                          {product.name}
                        </h3>
                      </Link>

                      {(product.average_rating ?? product.rating) !== undefined && (product.average_rating ?? product.rating) !== null && (
                        <StarRating value={product.average_rating ?? product.rating} readonly size="xs" className="mb-2" />
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-neutral-800">
                          {formatPrice(product.effective_price || product.sale_price || product.base_price)}
                        </span>
                        {product.sale_price && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(product.base_price)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          fullWidth
                          onClick={() => handleMoveToCart(item)}
                          leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemove(item.id)}
                          isLoading={removingId === item.id}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
