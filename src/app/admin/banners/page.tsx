'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link: string;
  is_active: boolean;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    image_url: '',
    link: '',
    is_active: true,
  });

  async function loadBanners() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data.banners ?? data ?? []);
    } catch {
      // ignore
    }
    setFetching(false);
  }

  useEffect(() => {
    loadBanners();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.image_url.trim()) return;
    setLoading(true);

    try {
      await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ title: '', image_url: '', link: '', is_active: true });
      loadBanners();
    } catch {
      alert('Failed to add banner');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this banner?')) return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      loadBanners();
    } catch {
      alert('Failed to delete banner');
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Image className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              required
              className={inputClass}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
              className={inputClass}
              placeholder="https://..."
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
          {loading ? 'Adding...' : 'Add Banner'}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Link</th>
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
              ) : banners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No banners yet.
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr key={banner.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="h-12 w-24 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{banner.title}</td>
                    <td className="px-6 py-3 text-sm text-gray-500 truncate max-w-[200px]">
                      {banner.link || '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          banner.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {banner.is_active ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => handleDelete(banner.id)}
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
