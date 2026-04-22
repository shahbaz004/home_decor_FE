import { cn } from '@/utils/cn.js';

function VariantPill({ label, selected, disabled, onClick, colorHex }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={disabled ? `${label} - Out of stock` : label}
      className={cn(
        'relative px-3.5 py-1.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 select-none',
        selected
          ? 'border-primary-600 bg-primary-50 text-primary-700'
          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400',
        disabled && 'opacity-40 cursor-not-allowed line-through'
      )}
    >
      {colorHex && (
        <span
          className="inline-block w-3.5 h-3.5 rounded-full border border-neutral-300 mr-1.5 align-middle"
          style={{ backgroundColor: colorHex }}
        />
      )}
      {label}
      {disabled && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-full h-px bg-neutral-400 rotate-45 absolute" />
        </span>
      )}
    </button>
  );
}

function VariantSelector({ variants = [], selected, onSelect, type = 'size', label }) {
  if (!variants.length) return null;

  const displayLabel = label || type.charAt(0).toUpperCase() + type.slice(1);

  const selectedVariant = variants.find(
    (v) => (typeof v === 'object' ? v.value : v) === selected
  );

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-medium text-neutral-700">{displayLabel}:</span>
        {selected && (
          <span className="text-sm text-primary-600 font-semibold">
            {typeof selectedVariant === 'object' ? selectedVariant.label : selectedVariant}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const value = typeof variant === 'object' ? variant.value : variant;
          const variantLabel = typeof variant === 'object' ? variant.label : variant;
          const inStock = typeof variant === 'object' ? variant.inStock !== false : true;
          const colorHex = typeof variant === 'object' ? variant.colorHex : null;

          return (
            <VariantPill
              key={value}
              label={variantLabel}
              selected={selected === value}
              disabled={!inStock}
              colorHex={colorHex}
              onClick={() => inStock && onSelect?.(value)}
            />
          );
        })}
      </div>
    </div>
  );
}

export function SizeGuideLink() {
  return (
    <button className="text-xs text-primary-600 underline hover:text-primary-800 transition-colors mt-1">
      Size Guide
    </button>
  );
}

export default VariantSelector;
