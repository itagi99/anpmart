'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice, imageSrc } from '@/lib/utils';
import { ArrowLeft, Package, LogOut, User, Settings, CreditCard, Truck, Bell, Shield } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => { router.push('/login'); });

    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { if (data.orders) setOrders(data.orders); });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <html lang="en">
        <head>
          <title>Profile - ANP MART</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
          <meta name="theme-color" content="#0c831f" />
          <link rel="manifest" href="/manifest.json" />
          <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body className="min-h-screen bg-gray-50 pb-20 font-mulish">
          <Header />
          <main className="flex items-center justify-center min-h-screen">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>Profile - ANP MART</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0c831f" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-50 pb-20 font-mulish">
        <Header />
        <main className="container-fluid p-4 pb-24">
          <div className="flex items-center gap-2 mb-4">
            <a href="/" className="p-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </a>
            <h1 className="text-xl font-black text-gray-900">Profile</h1>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email || user.phone}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Phone:</span> {user.phone}</p>
              <p><span className="font-medium">Role:</span> <span className="capitalize">{user.role}</span></p>
              <p><span className="font-medium">Member since:</span> {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Link
              href="/orders"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <Package className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">My Orders ({orders.length})</p>
                <p className="text-xs text-gray-500">View and track your orders</p>
              </div>
            </Link>

            <Link
              href="/profile/addresses"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Saved Addresses</p>
                <p className="text-xs text-gray-500">Manage delivery addresses</p>
              </div>
            </Link>

            <Link
              href="/profile/payment"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <CreditCard className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Payment Methods</p>
                <p className="text-xs text-gray-500">Manage UPI, cards</p>
              </div>
            </Link>

            <Link
              href="/profile/notifications"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Notifications</p>
                <p className="text-xs text-gray-500">Order updates & offers</p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition w-full text-left text-red-500"
            >
              <LogOut className="w-5 h-5" />
              <div>
                <p className="font-medium text-red-500">Logout</p>
                <p className="text-xs text-gray-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

function handleLogout() {
  fetch('/api/auth/logout').then(() => window.location.href = '/');
}