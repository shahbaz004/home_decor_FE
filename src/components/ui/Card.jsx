import { cn } from '@/utils/cn.js';

function Card({ children, className, hover = false, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-neutral-100 shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1 cursor-pointer',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-lg font-serif font-semibold text-neutral-800', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardFooter({ children, className }) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-neutral-100', className)}>
      {children}
    </div>
  );
}

export function StatCard({ title, value, change, icon, color = 'primary', className }) {
  const colorMap = {
    primary:    'bg-primary-50 text-primary-600',
    success:    'bg-green-50 text-green-600',
    warning:    'bg-yellow-50 text-yellow-600',
    error:      'bg-red-50 text-red-600',
    terracotta: 'bg-terracotta-50 text-terracotta-600',
    purple:     'bg-purple-50 text-purple-600',
  };

  return (
    <Card className={cn('flex items-start gap-4', className)}>
      {icon && (
        <div className={cn('p-3 rounded-xl flex-shrink-0', colorMap[color])}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-neutral-500 font-medium">{title}</p>
        <p className="text-2xl font-serif font-bold text-neutral-800 mt-1">{value}</p>
        {change !== undefined && (
          <p className={cn('text-xs mt-1 font-medium', change >= 0 ? 'text-green-600' : 'text-red-500')}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last period
          </p>
        )}
      </div>
    </Card>
  );
}

export default Card;
