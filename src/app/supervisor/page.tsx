import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Users, ShoppingBag, IndianRupee } from 'lucide-react';

export default async function SupervisorDashboard() {
  const session = await getSession();
  if (!session) redirect('/supervisor/login');

  const today = new Date().toISOString().split('T')[0];

  const [salesmen, orders, revenue] = await Promise.all([
    dbQuery('SELECT COUNT(*) as count FROM users WHERE role = ?', ['salesman']),
    dbQuery('SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = ?', [today]),
    dbQuery('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE DATE(created_at) = ?', [today]),
  ]);

  const stats = [
    { label: 'Total Salesmen', value: Number(salesmen[0]?.count ?? 0), icon: Users, color: 'bg-indigo-500' },
    { label: "Today's Orders", value: Number(orders[0]?.count ?? 0), icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Today\'s Revenue', value: `₹${Number(revenue[0]?.total ?? 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Supervisor Dashboard</h1>
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
