import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatPrice(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '—';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch {
    return '—';
  }
}

export function formatRelativeDate(date) {
  if (!date) return '—';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return '—';
  }
}

export function formatOrderStatus(status) {
  const statusMap = {
    pending:    { label: 'Pending',     color: 'bg-yellow-100 text-yellow-800' },
    confirmed:  { label: 'Confirmed',   color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Processing',  color: 'bg-blue-100 text-blue-800' },
    shipped:    { label: 'Shipped',     color: 'bg-purple-100 text-purple-800' },
    delivered:  { label: 'Delivered',   color: 'bg-green-100 text-green-800' },
    cancelled:  { label: 'Cancelled',   color: 'bg-red-100 text-red-800' },
    refunded:   { label: 'Refunded',    color: 'bg-gray-100 text-gray-800' },
    failed:     { label: 'Failed',      color: 'bg-red-100 text-red-800' },
  };
  return statusMap[status?.toLowerCase()] || { label: status || 'Unknown', color: 'bg-gray-100 text-gray-600' };
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercentage(value, total) {
  if (!total) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}

export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
