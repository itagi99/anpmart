'use client';

import { useCart } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { CartItemRow } from '@/components/cart-item';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, total } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">My Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-500 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-400 mb-4">Add items to get started</p>
            <Link
              href="/"
              className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block w-full py-3 bg-emerald-500 text-white text-center rounded-xl font-semibold hover:bg-emerald-600 transition"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
