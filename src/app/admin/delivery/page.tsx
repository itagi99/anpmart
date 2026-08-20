'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Truck } from 'lucide-react';

interface DeliveryRule {
  id: string;
  name: string;
  min_order: number;
  max_order: number;
  fee: number;
  estimated_days: number;
  is_active: boolean;
}

export default function DeliveryPage() {
  const [rules, setRules] = useState<DeliveryRule[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    min_order: '',
    max_order: '',
    fee: '',
    estimated_days: '',
    is_active: true,
  });

  async function loadRules() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/delivery');
      const data = await res.json();
      setRules(data.rules ?? data.delivery_rules ?? data ?? []);
    } catch {
      // ignore
    }
    setFetching(false);
  }

  useEffect(() => {
    loadRules();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    try {
      await fetch('/api/admin/delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          min_order: Number(form.min_order) || 0,
          max_order: Number(form.max_order) || 0,
          fee: Number(form.fee) || 0,
          estimated_days: Number(form.estimated_days) || 1,
        }),
      });
      setForm({
        name: '',
        min_order: '',
        max_order: '',
        fee: '',
        estimated_days: '',
        is_active: true,
      });
      loadRules();
    } catch {
      alert('Failed to add delivery rule');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this delivery rule?')) return;
    try {
      await fetch(`/api/admin/delivery/${id}`, { method: 'DELETE' });
      loadRules();
    } catch {
      alert('Failed to delete delivery rule');
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Truck className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Delivery Rules</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className={inputClass}
              placeholder="Standard Delivery"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Order (₹)</label>
            <input
              type="number"
              value={form.max_order}
              onChange={(e) => setForm((p) => ({ ...p, max_order: e.target.value }))}
              min="0"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
            <input
              type="number"
              value={form.fee}
              onChange={(e) => setForm((p) => ({ ...p, fee: e.target.value }))}
              min="0"
              step="0.01"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Est. Days</label>
            <input
              type="number"
              value={form.estimated_days}
              onChange={(e) => setForm((p) => ({ ...p, estimated_days: e.target.value }))}
              min="1"
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Active
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition"
        >
          <Plus size={16} />
          {loading ? 'Adding...' : 'Add Rule'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Min Order</th>
                <th className="px-6 py-3 font-medium">Max Order</th>
                <th className="px-6 py-3 font-medium">Fee</th>
                <th className="px-6 py-3 font-medium">Days</th>
                <th className="px-6 py-3 font-medium">Active</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No delivery rules yet.
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{rule.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      ₹{Number(rule.min_order).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      ₹{Number(rule.max_order).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3 text-sm font-medium">
                      ₹{Number(rule.fee).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{rule.estimated_days} days</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {rule.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(rule.id)}
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
