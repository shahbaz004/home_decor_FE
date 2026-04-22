import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useGetProductsQuery } from '@/api/apiSlice.js';
import ProductGrid from '@/components/products/ProductGrid.jsx';
import Input from '@/components/ui/Input.jsx';
import Pagination from '@/components/ui/Pagination.jsx';

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery });
      setPage(1);
    }
  }, [debouncedQuery]);

  const { data, isLoading } = useGetProductsQuery(
    { search: debouncedQuery, page, page_size: 12 },
    { skip: !debouncedQuery }
  );

  const products = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-display font-bold text-neutral-800 text-center mb-6">
            Search Products
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for vases, cushions, lamps..."
              autoFocus
              className="w-full pl-12 pr-12 py-4 text-base rounded-2xl border-2 border-neutral-200 bg-white focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/10 shadow-sm transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {debouncedQuery && (
          <div>
            {!isLoading && (
              <p className="text-neutral-500 text-sm mb-6">
                {totalCount > 0
                  ? `Found ${totalCount} result${totalCount !== 1 ? 's' : ''} for "${debouncedQuery}"`
                  : `No results found for "${debouncedQuery}"`}
              </p>
            )}

            <ProductGrid products={products} isLoading={isLoading} />

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                className="mt-10"
              />
            )}
          </div>
        )}

        {!debouncedQuery && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-400">Type to search for products...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
