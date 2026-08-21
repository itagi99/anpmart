'use client';
import { useState } from 'react';
import { useCart } from '@/store/cart';
import { formatPrice, imageSrc } from '@/lib/utils';
import { ArrowLeft, Trash2, Minus, Plus, ShoppingCart, Check } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <html lang="en">
      <head>
        <title>My Cart - ANP MART</title>
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
            <Link href="/" className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-black text-gray-900">My Cart</h1>
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
                  <div key={item.productId} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0 relative">
                      <img src={imageSrc(item.image)} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.name}</p>
                      {item.unit && <p className="text-xs text-gray-400">{item.unit}</p>}
                      <p className="text-emerald-600 font-bold text-sm">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-emerald-300 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm sticky bottom-0 z-10 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="text-xl font-black text-gray-900">{formatPrice(total())}</span>
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
      </body>
    </html>
  );
}