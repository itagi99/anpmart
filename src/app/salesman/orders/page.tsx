import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

export default async function SalesmanOrdersPage() {
  const session = await getSession();
  if (!session) redirect('/salesman/login');

  const orders = await dbQuery(
    `SELECT id, customer_name, customer_phone, total, status, created_at
     FROM orders WHERE salesman_id = ?
     ORDER BY created_at DESC LIMIT 50`,
    [session.userId]
  );

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="divide-y">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No orders yet</p>
            </div>
          ) : (
            orders.map((order: any) => (
              <div key={order.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">#{order.id} — {order.customer_name}</p>
                  <p className="text-xs text-gray-500">
                    {order.customer_phone} &middot; {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{Number(order.total).toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
