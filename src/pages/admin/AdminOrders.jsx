import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from '@/api/apiSlice.js';
import { formatPrice, formatDate } from '@/utils/formatters.js';
import { StatusBadge } from '@/components/ui/Badge.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

function AdminOrders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading } = useGetAdminOrdersQuery({
    page, page_size: 15, search,
    ...(statusFilter ? { status: statusFilter } : {}),
  });
  const [updateStatus] = useUpdateOrderStatusMutation();

  const orders = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-serif font-bold text-neutral-800">Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-neutral-100 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 w-48"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400 bg-white"
        >
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        {(search || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
            className="text-sm text-neutral-500 hover:text-neutral-700 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={6} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${order.id}`} className="font-mono text-primary-600 hover:underline text-sm">
                        #{order.order_number || order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-neutral-800 text-sm">{order.user?.first_name} {order.user?.last_name}</p>
                      <p className="text-xs text-neutral-400 truncate max-w-[140px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-primary-400"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-neutral-400">No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-neutral-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
