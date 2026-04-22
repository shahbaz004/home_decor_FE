import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn.js';

function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
  showCount,
  className,
}) {
  const [hovered, setHovered] = useState(0);

  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const iconSize = sizeMap[size];

  const displayValue = hovered || value;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = displayValue >= star;
          const isHalf = !isFilled && displayValue >= star - 0.5;

          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => !readonly && onChange?.(star)}
              onMouseEnter={() => !readonly && setHovered(star)}
              onMouseLeave={() => !readonly && setHovered(0)}
              className={cn(
                'focus:outline-none transition-transform duration-100',
                !readonly && 'hover:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <Star
                className={cn(
                  iconSize,
                  'transition-colors duration-150',
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-200 text-amber-400'
                    : 'fill-neutral-200 text-neutral-300'
                )}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className={cn('font-medium text-neutral-700', size === 'sm' ? 'text-sm' : 'text-base')}>
          {value.toFixed(1)}
        </span>
      )}

      {showCount !== undefined && (
        <span className="text-sm text-neutral-400">({showCount})</span>
      )}
    </div>
  );
}

export function RatingBar({ rating, count, total }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-500 w-12 text-right">{rating} star</span>
      <div className="flex-1 bg-neutral-100 rounded-full h-2">
        <div
          className="bg-amber-400 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-neutral-500 w-8">{count}</span>
    </div>
  );
}

export default StarRating;
