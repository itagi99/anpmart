'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      window.location.reload();
    } catch {
      alert('Failed to delete product');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm disabled:opacity-50 transition"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}
