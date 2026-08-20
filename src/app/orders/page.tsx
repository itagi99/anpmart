import { redirect } from 'next/navigation';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Header from '@/components/header';
import BottomNav from '@/components/bottom-nav';
import { formatPrice } from '@/lib/utils';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
}

async function getOrders(userId: number): Promise<Order[]> {
  return dbQuery<Order[]>(
    'SELECT id, created_at, total, status, payment_method FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    confirmed: <Package className="w-3 h-3" />,
    processing: <Package className="w-3 h-3" />,
    delivered: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const orders = await getOrders(session.userId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No orders yet</p>
            <a href="/" className="text-emerald-600 font-medium text-sm">Start Shopping</a>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <a
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Order #{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-IN')}
                  </span>
                  <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
