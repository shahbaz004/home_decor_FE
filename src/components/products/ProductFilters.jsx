import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Slider from '@radix-ui/react-slider';
import * as Checkbox from '@radix-ui/react-checkbox';
import { ChevronDown, ChevronUp, Check, X, SlidersHorizontal } from 'lucide-react';
import { useGetCategoriesQuery } from '@/api/apiSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import { cn } from '@/utils/cn.js';
import Button from '@/components/ui/Button.jsx';

const MATERIALS = ['Wood', 'Metal', 'Fabric', 'Ceramic', 'Glass', 'Rattan', 'Marble'];
const COLORS = [
  { label: 'Terracotta', value: 'terracotta', hex: '#dc5e38' },
  { label: 'Beige', value: 'beige', hex: '#d4b896' },
  { label: 'Navy', value: 'navy', hex: '#1a2e4a' },
  { label: 'Forest Green', value: 'green', hex: '#2d5a3d' },
  { label: 'Warm Gray', value: 'gray', hex: '#8b8680' },
  { label: 'White', value: 'white', hex: '#f5f5f4' },
  { label: 'Gold', value: 'gold', hex: '#d4a017' },
  { label: 'Black', value: 'black', hex: '#1c1917' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: '-created_at' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Most Popular', value: '-sales_count' },
  { label: 'Top Rated', value: '-rating' },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-100 pb-4 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-neutral-800 mb-3 hover:text-primary-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && children}
    </div>
  );
}

function ProductFilters({ onFilterChange, className }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.results || categoriesData || [];

  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('-created_at');

  // Sync from URL
  useEffect(() => {
    const minPrice = Number(searchParams.get('min_price')) || 0;
    const maxPrice = Number(searchParams.get('max_price')) || 50000;
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors(searchParams.get('colors')?.split(',').filter(Boolean) || []);
    setSelectedMaterials(searchParams.get('materials')?.split(',').filter(Boolean) || []);
    setMinRating(Number(searchParams.get('rating')) || 0);
    setSortBy(searchParams.get('ordering') || '-created_at');
  }, []);

  const applyFilters = (overrides = {}) => {
    const params = new URLSearchParams(searchParams);
    const filters = {
      min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
      max_price: priceRange[1] < 50000 ? priceRange[1] : undefined,
      colors: selectedColors.length ? selectedColors.join(',') : undefined,
      materials: selectedMaterials.length ? selectedMaterials.join(',') : undefined,
      rating: minRating > 0 ? minRating : undefined,
      ordering: sortBy !== '-created_at' ? sortBy : undefined,
      ...overrides,
    };

    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, String(val));
      else params.delete(key);
    });
    params.delete('page');
    setSearchParams(params);
    onFilterChange?.(filters);
  };

  const toggleColor = (color) => {
    const next = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];
    setSelectedColors(next);
  };

  const toggleMaterial = (material) => {
    const next = selectedMaterials.includes(material)
      ? selectedMaterials.filter((m) => m !== material)
      : [...selectedMaterials, material];
    setSelectedMaterials(next);
  };

  const clearAll = () => {
    setPriceRange([0, 50000]);
    setSelectedColors([]);
    setSelectedMaterials([]);
    setMinRating(0);
    setSortBy('-created_at');
    const params = new URLSearchParams(searchParams);
    ['min_price', 'max_price', 'colors', 'materials', 'rating', 'ordering'].forEach((k) => params.delete(k));
    setSearchParams(params);
  };

  const hasActiveFilters =
    priceRange[0] > 0 || priceRange[1] < 50000 || selectedColors.length ||
    selectedMaterials.length || minRating > 0;

  return (
    <aside className={cn('bg-white rounded-2xl p-5 border border-neutral-100 sticky top-24', className)}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary-600" />
          <h2 className="font-serif font-semibold text-neutral-800">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      {/* Sort */}
      <FilterSection title="Sort By" defaultOpen={true}>
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); applyFilters({ ordering: e.target.value }); }}
          className="w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-400 bg-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FilterSection>

      {/* Categories */}
      {categories.length > 0 && (
        <FilterSection title="Categories" defaultOpen={true}>
          <div className="space-y-2">
            {categories.map((cat) => {
              const isSelected = searchParams.get('category') === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    if (isSelected) params.delete('category');
                    else params.set('category', cat.slug);
                    params.delete('page');
                    setSearchParams(params);
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-sm transition-colors',
                    isSelected ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                  )}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-neutral-400">({cat.product_count || 0})</span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
          <Slider.Root
            className="relative flex items-center w-full h-5 select-none"
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={50000}
            step={500}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="bg-neutral-200 relative grow rounded-full h-1.5">
              <Slider.Range className="absolute bg-primary-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-primary-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer" />
            <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-primary-500 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer" />
          </Slider.Root>
          <Button size="sm" variant="outline" fullWidth className="mt-4" onClick={() => applyFilters()}>
            Apply Price
          </Button>
        </div>
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(({ label, value, hex }) => (
            <button
              key={value}
              onClick={() => toggleColor(value)}
              title={label}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-transform hover:scale-110',
                selectedColors.includes(value) ? 'border-neutral-800 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: hex }}
              aria-label={label}
            />
          ))}
        </div>
        {selectedColors.length > 0 && (
          <Button size="sm" variant="outline" fullWidth className="mt-3" onClick={() => applyFilters()}>
            Apply Colors
          </Button>
        )}
      </FilterSection>

      {/* Materials */}
      <FilterSection title="Materials" defaultOpen={false}>
        <div className="space-y-2">
          {MATERIALS.map((material) => (
            <label key={material} className="flex items-center gap-2.5 cursor-pointer group">
              <Checkbox.Root
                checked={selectedMaterials.includes(material)}
                onCheckedChange={() => toggleMaterial(material)}
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                  selectedMaterials.includes(material)
                    ? 'bg-primary-600 border-primary-600'
                    : 'border-neutral-300 group-hover:border-primary-400'
                )}
              >
                <Checkbox.Indicator>
                  <Check className="w-3 h-3 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="text-sm text-neutral-600 group-hover:text-neutral-800 transition-colors">
                {material}
              </span>
            </label>
          ))}
        </div>
        {selectedMaterials.length > 0 && (
          <Button size="sm" variant="outline" fullWidth className="mt-3" onClick={() => applyFilters()}>
            Apply Materials
          </Button>
        )}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating" defaultOpen={false}>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => { setMinRating(rating === minRating ? 0 : rating); }}
              className={cn(
                'flex items-center gap-2 w-full px-2 py-1 rounded-lg text-sm transition-colors',
                minRating === rating ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-50'
              )}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} className={cn('w-3.5 h-3.5', s <= rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300 fill-neutral-300')} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" fullWidth className="mt-3" onClick={() => applyFilters()}>
          Apply Rating
        </Button>
      </FilterSection>

      <Button variant="primary" fullWidth onClick={() => applyFilters()}>
        Apply All Filters
      </Button>
    </aside>
  );
}

export default ProductFilters;
