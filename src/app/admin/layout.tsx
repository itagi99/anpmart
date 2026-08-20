import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Image,
  Ticket,
  Truck,
  UserCheck,
  LogOut,
  Menu,
} from 'lucide-react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/delivery', label: 'Delivery', icon: Truck },
  { href: '/admin/salesmen', label: 'Salesmen', icon: UserCheck },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-gray-900 text-white z-50">
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-xl font-bold tracking-wide">Admin Panel</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-700 p-3">
          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors text-red-400"
          >
            <LogOut size={18} />
            Logout
          </a>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <span className="text-lg font-bold">Admin Panel</span>
        <details className="relative">
          <summary className="cursor-pointer list-none">
            <Menu size={24} />
          </summary>
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-700"
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
            <hr className="border-gray-700 my-2" />
            <a
              href="/api/auth/logout"
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              <LogOut size={16} />
              Logout
            </a>
          </div>
        </details>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
