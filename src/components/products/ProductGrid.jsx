import { cn } from '@/utils/cn.js';
import ProductCard from './ProductCard.jsx';
import { ProductGridSkeleton } from '@/components/ui/Skeleton.jsx';

function ProductGrid({ products = [], isLoading = false, columns = 4, className }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  if (isLoading) {
    return <ProductGridSkeleton count={columns * 2} />;
  }

  if (!isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-serif font-semibold text-neutral-700 mb-2">No Products Found</h3>
        <p className="text-sm text-neutral-400 max-w-xs">
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 lg:gap-6', gridCols[columns] || gridCols[4], className)}>
      {products.map((product) => (
        <ProductCard key={product.id || product.slug} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
