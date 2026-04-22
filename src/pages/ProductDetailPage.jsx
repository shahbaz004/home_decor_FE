import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, ShoppingCart, Minus, Plus, Truck, Shield, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import { useGetProductQuery } from '@/api/apiSlice.js';
import { useCart } from '@/hooks/useCart.js';
import { formatPrice } from '@/utils/formatters.js';
import ProductImageGallery from '@/components/products/ProductImageGallery.jsx';
import VariantSelector from '@/components/products/VariantSelector.jsx';
import ReviewSection from '@/components/products/ReviewSection.jsx';
import ProductGrid from '@/components/products/ProductGrid.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';
import StarRating from '@/components/ui/StarRating.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import { PageSpinner } from '@/components/ui/Spinner.jsx';
import Skeleton from '@/components/ui/Skeleton.jsx';
import { cn } from '@/utils/cn.js';
import toast from 'react-hot-toast';

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-sm font-semibold text-neutral-800 hover:text-primary-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="pb-4 text-sm text-neutral-600 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useGetProductQuery(slug);
  const { addToCart, isAdding } = useCart();

  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (isLoading) return <PageSpinner />;

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-neutral-800 mb-2">Product not found</h2>
          <Link to="/products" className="text-primary-600 hover:underline">← Browse all products</Link>
        </div>
      </div>
    );
  }

  const {
    id, name, description, price, sale_price: salePrice, images, category,
    rating, review_count: reviewCount, stock, variants, materials, dimensions,
    weight, sku, is_featured: isFeatured,
  } = product;

  const discountPercent = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;
  const inStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;

  const handleAddToCart = async () => {
    await addToCart(
      { id, name, price, salePrice, images, slug },
      Object.keys(selectedVariants).length > 0 ? selectedVariants : null,
      quantity
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    ...(category ? [{ label: category.name, href: `/products?category=${category.slug}` }] : []),
    { label: name },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery images={images} productName={name} />
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {category && (
                <Link to={`/products?category=${category.slug}`}>
                  <Badge variant="primary" size="sm">{category.name}</Badge>
                </Link>
              )}
              {isFeatured && <Badge variant="terracotta" size="sm">Featured</Badge>}
              {lowStock && <Badge variant="warning" size="sm">Only {stock} left!</Badge>}
              {!inStock && <Badge variant="error" size="sm">Out of Stock</Badge>}
            </div>

            <h1 className="text-3xl lg:text-4xl font-display font-bold text-neutral-800 leading-tight mb-4">
              {name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <StarRating value={rating || 0} readonly showValue size="md" />
              <span className="text-sm text-neutral-500">({reviewCount || 0} reviews)</span>
              {sku && <span className="text-xs text-neutral-400 ml-2">SKU: {sku}</span>}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold font-serif text-neutral-800">
                {formatPrice(salePrice || price)}
              </span>
              {salePrice && (
                <>
                  <span className="text-xl text-neutral-400 line-through">{formatPrice(price)}</span>
                  <Badge variant="error" size="md">Save {discountPercent}%</Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            {description && (
              <p className="text-neutral-600 leading-relaxed mb-6 text-sm">
                {description.slice(0, 200)}{description.length > 200 ? '...' : ''}
              </p>
            )}

            {/* Variants */}
            {variants && Object.entries(variants).map(([type, opts]) => (
              <VariantSelector
                key={type}
                type={type}
                variants={opts}
                selected={selectedVariants[type]}
                onSelect={(val) => setSelectedVariants((prev) => ({ ...prev, [type]: val }))}
              />
            ))}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-neutral-700">Quantity:</span>
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-neutral-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                  disabled={quantity >= stock}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {inStock && (
                <span className="text-sm text-neutral-400">{stock} available</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                fullWidth
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                isLoading={isAdding}
                leftIcon={<ShoppingCart className="w-5 h-5" />}
              >
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                size="icon"
                variant={isWishlisted ? 'warm' : 'outline'}
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Add to wishlist"
                className="flex-shrink-0 px-4"
              >
                <Heart className={cn('w-5 h-5', isWishlisted && 'fill-white')} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleShare}
                aria-label="Share"
                className="flex-shrink-0 px-4"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="border border-neutral-100 rounded-2xl divide-y divide-neutral-100">
              {[
                { icon: Truck, title: 'Free Delivery', desc: 'On orders above ₹2,000. Expected in 5-7 days.' },
                { icon: RefreshCcw, title: 'Easy Returns', desc: '30-day return policy. No questions asked.' },
                { icon: Shield, title: 'Authentic Products', desc: 'All products are handpicked and quality assured.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">{title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Details / Reviews */}
        <Tabs.Root defaultValue="description" className="mb-16">
          <Tabs.List className="flex border-b border-neutral-200 mb-8">
            {['description', 'details', 'reviews'].map((tab) => (
              <Tabs.Trigger
                key={tab}
                value={tab}
                className="px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-neutral-500 hover:text-neutral-700"
              >
                {tab === 'reviews' ? `Reviews (${reviewCount || 0})` : tab}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="description" className="prose prose-sm max-w-none text-neutral-700 leading-relaxed">
            {description || 'No description available.'}
          </Tabs.Content>

          <Tabs.Content value="details">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-neutral-800 mb-3">Product Specifications</h3>
                <div className="space-y-2">
                  {[
                    { label: 'SKU', value: sku },
                    { label: 'Material', value: materials?.join(', ') || 'N/A' },
                    { label: 'Weight', value: weight ? `${weight} kg` : 'N/A' },
                    { label: 'In Stock', value: inStock ? `Yes (${stock} units)` : 'No' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-sm py-2 border-b border-neutral-100 last:border-0">
                      <span className="text-neutral-500 w-28 flex-shrink-0">{label}</span>
                      <span className="text-neutral-800 font-medium">{value || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
              {dimensions && (
                <div>
                  <h3 className="font-semibold text-neutral-800 mb-3">Dimensions</h3>
                  <div className="space-y-2">
                    {Object.entries(dimensions).map(([key, val]) => (
                      <div key={key} className="flex gap-4 text-sm py-2 border-b border-neutral-100 last:border-0">
                        <span className="text-neutral-500 capitalize w-28">{key}</span>
                        <span className="text-neutral-800 font-medium">{val} cm</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Accordion */}
            <div className="mt-8">
              <h3 className="font-semibold text-neutral-800 mb-2">FAQs</h3>
              <AccordionItem title="How do I care for this product?">
                Wipe clean with a soft, damp cloth. Avoid harsh chemicals or abrasives. Keep away from direct sunlight to prevent color fading.
              </AccordionItem>
              <AccordionItem title="Can I return this product?">
                Yes, we offer a 30-day hassle-free return policy. The product must be in its original condition and packaging.
              </AccordionItem>
              <AccordionItem title="Is this handmade?">
                Yes, our artisans handcraft each piece with love and attention to detail. Minor variations are natural and add to the uniqueness.
              </AccordionItem>
            </div>
          </Tabs.Content>

          <Tabs.Content value="reviews">
            <ReviewSection productId={id} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

export default ProductDetailPage;
