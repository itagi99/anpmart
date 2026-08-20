import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Truck, MapPin, Clock } from 'lucide-react';

export default async function DeliverymanDashboard() {
  const session = await getSession();
  if (!session) redirect('/deliveryman/login');

  const deliveries = await dbQuery(
    `SELECT id, customer_name, customer_phone, customer_address, total, status, created_at
     FROM orders WHERE deliveryman_id = ?
     ORDER BY created_at DESC LIMIT 30`,
    [session.userId]
  );

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    out_for_delivery: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My Deliveries</h1>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Assigned Deliveries
          </h2>
        </div>
        <div className="divide-y">
          {deliveries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No deliveries assigned</p>
            </div>
          ) : (
            deliveries.map((d: any) => (
              <div key={d.id} className="px-4 py-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order #{d.id} — {d.customer_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {d.customer_address || 'No address'}
                    </p>
                    <p className="text-xs text-gray-500">{d.customer_phone}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(d.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{Number(d.total).toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[d.status] || 'bg-gray-100 text-gray-600'}`}>
                      {d.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
