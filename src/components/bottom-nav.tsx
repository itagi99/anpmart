'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/categories', label: 'Categories', icon: Grid3X3 },
  { href: '/cart', label: 'Cart', icon: ShoppingBag },
  { href: '/profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const count = useCart((s) => s.count());
  if (pathname.startsWith('/admin') || pathname.startsWith('/salesman') || pathname.startsWith('/supervisor') || pathname.startsWith('/deliveryman')) return null;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden">
      <div className="flex justify-around py-2">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
          return (
            <Link key={l.href} href={l.href} className={cn('flex flex-col items-center gap-0.5 px-3 py-1 text-xs', active ? 'text-green-600' : 'text-gray-500')}>
              <div className="relative">
                <l.icon size={22} strokeWidth={active ? 2.5 : 1.5} />
                {l.href === '/cart' && count > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center">{count}</span>
                )}
              </div>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
