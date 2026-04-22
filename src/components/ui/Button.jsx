import { forwardRef } from 'react';
import { cn } from '@/utils/cn.js';
import Spinner from './Spinner.jsx';

const variants = {
  primary:     'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-warm disabled:bg-primary-300',
  secondary:   'bg-neutral-800 hover:bg-neutral-900 text-white shadow-sm disabled:bg-neutral-400',
  outline:     'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-neutral-300 disabled:text-neutral-400',
  ghost:       'text-neutral-700 hover:bg-neutral-100 disabled:text-neutral-300',
  destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm disabled:bg-red-300',
  warm:        'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm hover:shadow-warm disabled:bg-terracotta-300',
  link:        'text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto',
};

const sizes = {
  xs: 'px-2.5 py-1.5 text-xs rounded-md',
  sm: 'px-3.5 py-2 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-xl',
  icon: 'p-2 rounded-lg',
};

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 select-none cursor-pointer',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          (disabled || isLoading) && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="mr-2" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 -ml-0.5">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 -mr-0.5">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
