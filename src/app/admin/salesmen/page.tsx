'use client';

import { useState, useEffect } from 'react';
import { UserCheck, Plus, Trash2 } from 'lucide-react';

interface Salesman {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export default function SalesmenPage() {
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  async function loadSalesmen() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/salesmen');
      const data = await res.json();
      setSalesmen(data.salesmen ?? data ?? []);
    } catch {
      // ignore
    }
    setFetching(false);
  }

  useEffect(() => {
    loadSalesmen();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    try {
      await fetch('/api/admin/salesmen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ name: '', email: '', phone: '' });
      loadSalesmen();
    } catch {
      alert('Failed to add salesman');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this salesman?')) return;
    try {
      await fetch(`/api/admin/salesmen/${id}`, { method: 'DELETE' });
      loadSalesmen();
    } catch {
      alert('Failed to delete salesman');
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCheck className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Salesmen</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Name"
          required
          className={inputClass}
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="Email"
          className={inputClass}
        />
        <input
          type="text"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="Phone"
          className={inputClass}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition whitespace-nowrap"
        >
          <Plus size={16} />
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Active</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : salesmen.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No salesmen yet.
                  </td>
                </tr>
              ) : (
                salesmen.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{s.email ?? '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{s.phone ?? '—'}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {s.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
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
