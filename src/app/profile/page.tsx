import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { User, Package, LogOut, LogIn } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8 text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-700 mb-2">Login Required</p>
          <p className="text-sm text-gray-500 mb-6">Sign in to view your profile</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">Profile</h1>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{session.name}</p>
              <p className="text-sm text-gray-500">{session.email || session.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/orders"
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <Package className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">My Orders</span>
          </Link>

          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="font-medium text-red-500">Logout</span>
          </a>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
