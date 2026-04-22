import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useGetCustomersQuery } from '@/api/apiSlice.js';
import { formatPrice, formatDate } from '@/utils/formatters.js';
import Pagination from '@/components/ui/Pagination.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';
import Badge from '@/components/ui/Badge.jsx';

function AdminCustomers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetCustomersQuery({ page, page_size: 15, search });
  const customers = data?.results || [];
  const totalPages = data ? Math.ceil(data.count / 15) : 1;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-serif font-bold text-neutral-800">Customers</h1>

      <div className="bg-white rounded-xl border border-neutral-100 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-primary-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={8} cols={5} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Status'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs flex-shrink-0">
                          {customer.first_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-neutral-800">
                          {customer.first_name} {customer.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{customer.email}</td>
                    <td className="px-4 py-3 text-neutral-800 font-medium">{customer.order_count || 0}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">{formatPrice(customer.total_spent || 0)}</td>
                    <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(customer.date_joined)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={customer.is_active ? 'success' : 'default'}>
                        {customer.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-neutral-400">No customers found</td>
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

export default AdminCustomers;
