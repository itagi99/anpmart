import { dbQuery } from '@/lib/db';
import { ShoppingCart } from 'lucide-react';
import StatusUpdateButton from './StatusUpdateButton';

async function getOrders() {
  return dbQuery<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
  }>(
    `SELECT o.id, o.total, o.status, o.created_at,
            u.name as customer_name, u.email as customer_email
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Order ID</th>
                <th className="px-6 py-3 font-medium">Customer</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono">
                      <a href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                        {order.id}
                      </a>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div>{order.customer_name ?? 'N/A'}</div>
                      <div className="text-gray-400 text-xs">{order.customer_email}</div>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium">
                      ₹{Number(order.total).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3">
                      <StatusUpdateButton
                        orderId={order.id}
                        currentStatus={order.status}
                        options={STATUS_OPTIONS}
                      />
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
