'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Ticket } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order: '',
    max_uses: '',
    expires_at: '',
    is_active: true,
  });

  async function loadCoupons() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      setCoupons(data.coupons ?? data ?? []);
    } catch {
      // ignore
    }
    setFetching(false);
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) return;
    setLoading(true);

    try {
      await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: form.code.trim().toUpperCase(),
          discount_value: Number(form.discount_value),
          min_order: Number(form.min_order) || 0,
          max_uses: Number(form.max_uses) || 0,
        }),
      });
      setForm({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order: '',
        max_uses: '',
        expires_at: '',
        is_active: true,
      });
      loadCoupons();
    } catch {
      alert('Failed to add coupon');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch {
      alert('Failed to delete coupon');
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ticket className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
              required
              className={inputClass}
              placeholder="SAVE20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm((p) => ({ ...p, discount_type: e.target.value }))}
              className={inputClass}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
            <input
              type="number"
              value={form.discount_value}
              onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))}
              required
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
            <input
              type="number"
              value={form.min_order}
              onChange={(e) => setForm((p) => ({ ...p, min_order: e.target.value }))}
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
            <input
              type="number"
              value={form.max_uses}
              onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))}
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Active
          </label>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            <Plus size={16} />
            {loading ? 'Adding...' : 'Add Coupon'}
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Code</th>
                <th className="px-6 py-3 font-medium">Discount</th>
                <th className="px-6 py-3 font-medium">Min Order</th>
                <th className="px-6 py-3 font-medium">Uses</th>
                <th className="px-6 py-3 font-medium">Active</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-mono font-bold text-gray-900">
                      {coupon.code}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `₹${coupon.discount_value}`}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      ₹{Number(coupon.min_order).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {coupon.used_count}/{coupon.max_uses || '∞'}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {coupon.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm transition"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
