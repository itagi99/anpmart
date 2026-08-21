'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/store/cart';
import { Home, Grid, ShoppingBag, User, LogIn, UserCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: Grid },
  { href: '/cart', label: 'Cart', icon: ShoppingBag, showBadge: true },
  { href: '/profile', label: 'Profile', icon: UserCircle, auth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const cartCount = count();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50 rounded-t-2xl">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const showBadge = item.showBadge && cartCount > 0;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 w-1/4 transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? '-translate-y-1' : ''}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
              {showBadge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}