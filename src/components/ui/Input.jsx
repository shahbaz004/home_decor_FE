import { forwardRef } from 'react';
import { cn } from '@/utils/cn.js';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      type = 'text',
      className,
      containerClassName,
      required,
      ...props
    },
    ref
  ) => {
    const id = props.id || props.name;

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400',
              'transition-colors duration-200 outline-none',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 hover:border-neutral-400',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              props.disabled && 'bg-neutral-50 text-neutral-500 cursor-not-allowed',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-neutral-500 mt-0.5">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef(
  ({ label, error, helperText, className, containerClassName, required, rows = 4, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className={cn('flex flex-col gap-1', containerClassName)}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-neutral-800 placeholder:text-neutral-400 resize-vertical',
            'transition-colors duration-200 outline-none',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error ? 'border-red-400' : 'border-neutral-300 hover:border-neutral-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-xs text-neutral-500 mt-0.5">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Input;
