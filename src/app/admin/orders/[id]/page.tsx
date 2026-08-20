import { notFound } from 'next/navigation';
import Link from 'next/link';
import { dbQuery } from '@/lib/db';
import { ArrowLeft, Package } from 'lucide-react';

async function getOrder(id: string) {
  const orders = await dbQuery<{
    id: string;
    total: number;
    status: string;
    created_at: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
  }>(
    `SELECT o.id, o.total, o.status, o.created_at,
            u.name as customer_name, u.email as customer_email,
            u.phone as customer_phone, o.shipping_address
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     WHERE o.id = $1`,
    [id]
  );
  return orders[0] ?? null;
}

async function getOrderItems(orderId: string) {
  return dbQuery<{
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }>(
    `SELECT oi.product_name, oi.quantity, oi.price, (oi.quantity * oi.price) as total
     FROM order_items oi
     WHERE oi.order_id = $1`,
    [orderId]
  );
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, items] = await Promise.all([getOrder(id), getOrderItems(id)]);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Order {order.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package size={18} />
            Order Info
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-medium">₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{order.customer_name ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{order.customer_email ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone</span>
              <span className="font-medium">{order.customer_phone ?? 'N/A'}</span>
            </div>
            {order.shipping_address && (
              <div className="pt-2 border-t">
                <span className="text-gray-500 text-xs">Shipping Address</span>
                <p className="mt-1 text-gray-900">{order.shipping_address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Items</h2>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">No items found.</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between items-start text-sm border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-gray-500 text-xs">
                      {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ₹{Number(item.total).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
