import { dbQuery } from '@/lib/db';
import { Package, ShoppingCart, Users, Tags } from 'lucide-react';

async function getCounts() {
  const [products, orders, users, categories] = await Promise.all([
    dbQuery<{ count: number }>('SELECT COUNT(*)::int as count FROM products'),
    dbQuery<{ count: number }>('SELECT COUNT(*)::int as count FROM orders'),
    dbQuery<{ count: number }>('SELECT COUNT(*)::int as count FROM users'),
    dbQuery<{ count: number }>('SELECT COUNT(*)::int as count FROM categories'),
  ]);
  return {
    products: products[0]?.count ?? 0,
    orders: orders[0]?.count ?? 0,
    users: users[0]?.count ?? 0,
    categories: categories[0]?.count ?? 0,
  };
}

async function getRecentOrders() {
  return dbQuery<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    customer_name: string;
  }>(
    `SELECT o.id, o.total, o.status, o.created_at, u.name as customer_name
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC
     LIMIT 5`
  );
}

export default async function AdminDashboard() {
  const [counts, recentOrders] = await Promise.all([getCounts(), getRecentOrders()]);

  const stats = [
    { label: 'Products', value: counts.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Orders', value: counts.orders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Users', value: counts.users, icon: Users, color: 'bg-purple-500' },
    { label: 'Categories', value: counts.categories, icon: Tags, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono">{order.id}</td>
                    <td className="px-6 py-3 text-sm">{order.customer_name ?? 'N/A'}</td>
                    <td className="px-6 py-3 text-sm font-medium">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
