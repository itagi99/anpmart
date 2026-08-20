import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { ShoppingBag, ClipboardCheck, IndianRupee, Package } from 'lucide-react';

export default async function SalesmanDashboard() {
  const session = await getSession();
  const today = new Date().toISOString().split('T')[0];

  const [orders, attendance, revenue] = await Promise.all([
    dbQuery(
      'SELECT COUNT(*) as count FROM orders WHERE salesman_id = ? AND DATE(created_at) = ?',
      [session!.userId, today]
    ),
    dbQuery(
      'SELECT * FROM attendance WHERE user_id = ? AND DATE(date) = ?',
      [session!.userId, today]
    ),
    dbQuery(
      'SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE salesman_id = ? AND DATE(created_at) = ?',
      [session!.userId, today]
    ),
  ]);

  const stats = [
    { label: "Today's Orders", value: Number(orders[0]?.count ?? 0), icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Revenue Today', value: `₹${Number(revenue[0]?.total ?? 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-green-500' },
    { label: 'Attendance', value: attendance.length > 0 ? 'Punched In' : 'Not Punched', icon: ClipboardCheck, color: attendance.length > 0 ? 'bg-green-500' : 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
