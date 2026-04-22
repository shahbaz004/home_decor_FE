import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid, List } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useGetProductsQuery } from '@/api/apiSlice.js';
import ProductGrid from '@/components/products/ProductGrid.jsx';
import ProductFilters from '@/components/products/ProductFilters.jsx';
import Breadcrumb from '@/components/ui/Breadcrumb.jsx';
import Spinner from '@/components/ui/Spinner.jsx';
import Button from '@/components/ui/Button.jsx';
import { cn } from '@/utils/cn.js';

const PAGE_SIZE = 12;

function ProductListPage() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  const queryParams = {
    page,
    page_size: PAGE_SIZE,
    ...Object.fromEntries(searchParams.entries()),
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  const products = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasMore = page < totalPages;

  // Reset on filter change
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [searchParams.toString()]);

  // Accumulate products for infinite scroll
  useEffect(() => {
    if (products.length > 0) {
      if (page === 1) {
        setAllProducts(products);
      } else {
        setAllProducts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...products.filter((p) => !ids.has(p.id))];
        });
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (!isFetching && hasMore) setPage((p) => p + 1);
  };

  // Active filters as chips
  const activeFilters = [];
  if (searchParams.get('category')) activeFilters.push({ key: 'category', label: `Category: ${searchParams.get('category')}` });
  if (searchParams.get('min_price') || searchParams.get('max_price')) {
    activeFilters.push({ key: 'price', label: `Price: ₹${searchParams.get('min_price') || 0} - ₹${searchParams.get('max_price') || '50,000'}` });
  }
  if (searchParams.get('colors')) activeFilters.push({ key: 'colors', label: `Colors: ${searchParams.get('colors')}` });
  if (searchParams.get('rating')) activeFilters.push({ key: 'rating', label: `Rating: ${searchParams.get('rating')}+ stars` });

  const removeFilter = (key) => {
    const params = new URLSearchParams(searchParams);
    if (key === 'price') { params.delete('min_price'); params.delete('max_price'); }
    else params.delete(key);
    window.history.replaceState(null, '', `?${params.toString()}`);
    window.dispatchEvent(new Event('popstate'));
  };

  const categoryName = searchParams.get('category')
    ? searchParams.get('category').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb
            items={[
              { label: 'Products', href: '/products' },
              ...(categoryName ? [{ label: categoryName }] : []),
            ]}
            className="mb-3"
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-800">
                {categoryName || 'All Products'}
              </h1>
              <p className="text-neutral-500 mt-1 text-sm">
                {isLoading ? 'Loading...' : `${totalCount} products found`}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden"
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
            </Button>
          </div>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  {f.label}
                  <button onClick={() => removeFilter(f.key)} className="hover:text-primary-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-60 flex-shrink-0">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading && page === 1 ? (
              <ProductGrid isLoading products={[]} />
            ) : allProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Grid className="w-10 h-10 text-neutral-300" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-neutral-700 mb-2">No Products Found</h3>
                <p className="text-neutral-400 mb-6">Try changing your filters or search terms.</p>
                <Button variant="outline" onClick={() => window.history.pushState(null, '', '/products')}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={allProducts.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center py-8">
                    <Spinner size="md" className="text-primary-600" />
                  </div>
                }
                endMessage={
                  allProducts.length > PAGE_SIZE && (
                    <p className="text-center text-neutral-400 text-sm py-8">
                      You've seen all {totalCount} products!
                    </p>
                  )
                }
              >
                <ProductGrid products={allProducts} />
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <span className="font-semibold text-neutral-800">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <ProductFilters className="rounded-none border-0 shadow-none" onFilterChange={() => setMobileFiltersOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductListPage;
