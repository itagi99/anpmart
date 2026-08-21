'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { formatPrice, imageSrc } from '@/lib/utils';
import { ArrowLeft, Truck, CreditCard, Shield, Clock } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', payment_method: 'cod' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          payment_method: form.payment_method,
          items: items.map(i => ({ product_id: i.productId, quantity: i.quantity, product_name: i.name, price: i.price })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/orders/${data.orderId}`);
      }
    } catch (error) {
      alert('Order failed');
    }
    setSubmitting(false);
  };

  return (
    <html lang="en">
      <head>
        <title>Checkout - ANP MART</title>
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
            <Link href="/cart" className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-black text-gray-900">Checkout</h1>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between py-2 border-b last:border-b-0 text-sm">
                <span className="text-gray-600">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between mt-3 pt-3 border-t">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg text-gray-900">{formatPrice(total())}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3">Delivery Details</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="Delivery Address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-emerald-500 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold text-gray-900 mb-3">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={form.payment_method === 'cod'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-5 h-5 text-emerald-500"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Truck className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when you receive your order</p>
                    </div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300">
                  <input
                    type="radio"
                    name="payment_method"
                    value="online"
                    checked={form.payment_method === 'online'}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-5 h-5 text-emerald-500"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Online Payment</p>
                      <p className="text-xs text-gray-500">UPI, Cards, Net Banking</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-emerald-500 text-white text-center rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(total())}`}
            </button>
          </form>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}