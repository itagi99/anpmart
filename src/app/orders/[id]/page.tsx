import { redirect } from 'next/navigation';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatPrice } from '@/lib/utils';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_path: string;
}

interface Order {
  id: number;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
  name: string;
  phone: string;
  address: string;
}

async function getOrder(orderId: string, userId: number): Promise<Order | null> {
  const rows = await dbQuery<Order[]>(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [orderId, userId]
  );
  return rows[0] || null;
}

async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  return dbQuery<OrderItem[]>(
    `SELECT oi.id, p.name AS product_name, oi.quantity, oi.price, p.image_path
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = ?`,
    [orderId]
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
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const order = await getOrder(id, session.userId);
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Order not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const items = await getOrderItems(id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/orders" className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <StatusBadge status={order.status} />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium text-gray-900">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">{order.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium text-gray-900">{order.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">Address</span>
              <p className="font-medium text-gray-900 mt-1">{order.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Items
          </h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-b-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image_path && (
                    <img src={item.image_path} alt={item.product_name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">{formatPrice(order.total)}</span>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
