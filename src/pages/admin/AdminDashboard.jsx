import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, ShoppingBag, Users, Package, ArrowRight } from 'lucide-react';
import { useGetAdminStatsQuery, useGetSalesChartQuery, useGetTopProductsQuery, useGetAdminOrdersQuery } from '@/api/apiSlice.js';
import { formatPrice, formatDate } from '@/utils/formatters.js';
import Card, { StatCard } from '@/components/ui/Card.jsx';
import { StatusBadge } from '@/components/ui/Badge.jsx';
import { TableSkeleton } from '@/components/ui/Skeleton.jsx';

// Fallback data for demo
const DEMO_CHART = [
  { month: 'Nov', revenue: 42000, orders: 38 },
  { month: 'Dec', revenue: 68000, orders: 62 },
  { month: 'Jan', revenue: 55000, orders: 49 },
  { month: 'Feb', revenue: 71000, orders: 65 },
  { month: 'Mar', revenue: 89000, orders: 81 },
  { month: 'Apr', revenue: 96000, orders: 88 },
];

const DEMO_STATS = {
  total_revenue: 421000,
  total_orders: 383,
  total_customers: 1247,
  conversion_rate: 3.4,
  revenue_change: 12.5,
  orders_change: 8.3,
  customers_change: 15.2,
};

function AdminDashboard() {
  const { data: stats } = useGetAdminStatsQuery();
  const { data: chartData } = useGetSalesChartQuery({ period: '6months' });
  const { data: topProductsData } = useGetTopProductsQuery({ limit: 5 });
  const { data: recentOrdersData, isLoading: ordersLoading } = useGetAdminOrdersQuery({ page: 1, page_size: 5, ordering: '-created_at' });

  const s = stats?.data || DEMO_STATS;
  const chart = chartData?.data || DEMO_CHART;
  const topProducts = topProductsData?.data || [];
  const recentOrders = recentOrdersData?.results || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-800">Dashboard</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatPrice(s.total_revenue)}
          change={s.revenue_change}
          icon={<TrendingUp className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Total Orders"
          value={s.total_orders?.toLocaleString()}
          change={s.orders_change}
          icon={<ShoppingBag className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Customers"
          value={s.total_customers?.toLocaleString()}
          change={s.customers_change}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
        <StatCard
          title="Conversion Rate"
          value={`${s.conversion_rate}%`}
          icon={<Package className="w-6 h-6" />}
          color="terracotta"
        />
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif font-semibold text-neutral-800">Revenue Overview</h2>
          <span className="text-xs text-neutral-400">Last 6 months</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chart} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value, name) => [
                name === 'revenue' ? formatPrice(value) : value,
                name === 'revenue' ? 'Revenue' : 'Orders',
              ]}
              contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#d4812a" strokeWidth={2.5} dot={{ fill: '#d4812a', r: 4 }} name="revenue" />
            <Line type="monotone" dataKey="orders" stroke="#dc5e38" strokeWidth={2.5} dot={{ fill: '#dc5e38', r: 4 }} name="orders" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-serif font-semibold text-neutral-800">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {topProducts.length === 0 ? (
              <div className="p-5 text-center text-neutral-400 text-sm">No data available</div>
            ) : topProducts.map((p, i) => (
              <div key={p.product_id || p.id || i} className="flex items-center gap-3 p-4">
                <span className="text-sm font-bold text-neutral-300 w-5">{i + 1}</span>
                <img
                  src={p.image || `https://picsum.photos/seed/${p.product_id || p.id}/40/40`}
                  alt={p.product_name || p.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{p.product_name || p.name}</p>
                  <p className="text-xs text-neutral-400">{p.total_sold || p.sales_count || 0} sold</p>
                </div>
                <p className="text-sm font-semibold text-neutral-800">{formatPrice(p.total_revenue || p.revenue || 0)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-neutral-100">
            <h2 className="font-serif font-semibold text-neutral-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {ordersLoading ? (
            <div className="p-4"><TableSkeleton rows={5} cols={3} /></div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/admin/orders/${order.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800">#{order.order_number || order.id}</p>
                    <p className="text-xs text-neutral-400">{order.user?.email || 'Guest'}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <p className="text-sm font-semibold text-neutral-800">{formatPrice(order.total_amount)}</p>
                </Link>
              ))}
              {recentOrders.length === 0 && (
                <div className="p-5 text-center text-neutral-400 text-sm">No recent orders</div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
