'use client';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { ShoppingBag, Search } from 'lucide-react';

export function Header() {
  const count = useCart((s) => s.count());
  return (
    <header className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">ANP MART</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/search" className="p-2 hover:bg-white/10 rounded-full transition">
            <Search size={20} />
          </Link>
          <Link href="/cart" className="p-2 hover:bg-white/10 rounded-full transition relative">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
