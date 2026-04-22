import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useGetSalesChartQuery, useGetAdminStatsQuery } from '@/api/apiSlice.js';
import { formatPrice } from '@/utils/formatters.js';
import Card from '@/components/ui/Card.jsx';

const REVENUE_DATA = [
  { month: 'Oct', revenue: 38000, orders: 34 },
  { month: 'Nov', revenue: 42000, orders: 38 },
  { month: 'Dec', revenue: 68000, orders: 62 },
  { month: 'Jan', revenue: 55000, orders: 49 },
  { month: 'Feb', revenue: 71000, orders: 65 },
  { month: 'Mar', revenue: 89000, orders: 81 },
  { month: 'Apr', revenue: 96000, orders: 88 },
];

const ORDER_STATUS_DATA = [
  { name: 'Delivered', value: 65, color: '#22c55e' },
  { name: 'Processing', value: 15, color: '#3b82f6' },
  { name: 'Shipped', value: 12, color: '#a855f7' },
  { name: 'Cancelled', value: 5, color: '#ef4444' },
  { name: 'Pending', value: 3, color: '#f59e0b' },
];

const CATEGORY_DATA = [
  { name: 'Living Room', sales: 142, revenue: 89000 },
  { name: 'Bedroom', sales: 98, revenue: 61000 },
  { name: 'Kitchen', sales: 76, revenue: 38000 },
  { name: 'Lighting', sales: 64, revenue: 52000 },
  { name: 'Garden', sales: 43, revenue: 21000 },
  { name: 'Bathroom', sales: 38, revenue: 19000 },
];

const GEO_DATA = [
  { state: 'Maharashtra', orders: 124, revenue: 89000 },
  { state: 'Karnataka', orders: 98, revenue: 71000 },
  { state: 'Delhi', orders: 87, revenue: 62000 },
  { state: 'Tamil Nadu', orders: 65, revenue: 48000 },
  { state: 'Gujarat', orders: 54, revenue: 41000 },
];

const COLORS = ['#d4812a', '#dc5e38', '#a855f7', '#3b82f6', '#22c55e'];

function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-neutral-800">Analytics</h1>

      {/* Revenue Over Time */}
      <Card className="p-6">
        <h2 className="font-serif font-semibold text-neutral-800 mb-5">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v, name) => [name === 'revenue' ? formatPrice(v) : v, name === 'revenue' ? 'Revenue' : 'Orders']} contentStyle={{ borderRadius: 12, border: '1px solid #e7e5e4' }} />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#d4812a" strokeWidth={2.5} dot={{ r: 4 }} name="revenue" />
            <Line type="monotone" dataKey="orders" stroke="#dc5e38" strokeWidth={2.5} dot={{ r: 4 }} name="orders" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by Status - Pie Chart */}
        <Card className="p-6">
          <h2 className="font-serif font-semibold text-neutral-800 mb-5">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={ORDER_STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {ORDER_STATUS_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 12 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Categories - Bar Chart */}
        <Card className="p-6">
          <h2 className="font-serif font-semibold text-neutral-800 mb-5">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={CATEGORY_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#78716c' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v, name) => [name === 'revenue' ? formatPrice(v) : v, name]} contentStyle={{ borderRadius: 12 }} />
              <Bar dataKey="sales" fill="#d4812a" radius={[0, 4, 4, 0]} name="Sales" />
              <Bar dataKey="revenue" fill="#dc5e38" radius={[0, 4, 4, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Geographic Breakdown */}
      <Card className="p-6">
        <h2 className="font-serif font-semibold text-neutral-800 mb-5">Geographic Breakdown (Top States)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50">
              <tr>
                {['State', 'Orders', 'Revenue', 'Share'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {GEO_DATA.map((row, i) => {
                const totalOrders = GEO_DATA.reduce((a, b) => a + b.orders, 0);
                return (
                  <tr key={row.state} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">{row.state}</td>
                    <td className="px-4 py-3 text-neutral-600">{row.orders}</td>
                    <td className="px-4 py-3 font-semibold text-neutral-800">{formatPrice(row.revenue)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-neutral-100 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{ width: `${(row.orders / totalOrders) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-neutral-500">{Math.round((row.orders / totalOrders) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default AdminAnalytics;
