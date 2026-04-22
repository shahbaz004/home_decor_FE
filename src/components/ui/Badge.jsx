import { cn } from '@/utils/cn.js';

const variantStyles = {
  default:     'bg-neutral-100 text-neutral-700',
  primary:     'bg-primary-100 text-primary-800',
  success:     'bg-green-100 text-green-800',
  warning:     'bg-yellow-100 text-yellow-800',
  error:       'bg-red-100 text-red-800',
  info:        'bg-blue-100 text-blue-800',
  purple:      'bg-purple-100 text-purple-800',
  terracotta:  'bg-terracotta-100 text-terracotta-800',
};

const statusColorMap = {
  pending:    'warning',
  confirmed:  'info',
  processing: 'info',
  shipped:    'purple',
  delivered:  'success',
  cancelled:  'error',
  refunded:   'default',
  failed:     'error',
  active:     'success',
  inactive:   'default',
  approved:   'success',
  rejected:   'error',
  new:        'primary',
};

function Badge({ children, variant = 'default', status, size = 'md', dot = false, className }) {
  const resolvedVariant = status ? statusColorMap[status?.toLowerCase()] || 'default' : variant;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[resolvedVariant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            resolvedVariant === 'success' && 'bg-green-500',
            resolvedVariant === 'warning' && 'bg-yellow-500',
            resolvedVariant === 'error' && 'bg-red-500',
            resolvedVariant === 'info' && 'bg-blue-500',
            resolvedVariant === 'purple' && 'bg-purple-500',
            resolvedVariant === 'default' && 'bg-neutral-500',
            resolvedVariant === 'primary' && 'bg-primary-500',
          )}
        />
      )}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }) {
  return (
    <Badge status={status} dot className={className}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
}

export default Badge;
