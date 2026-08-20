'use client';

import { useState } from 'react';

interface Props {
  orderId: string;
  currentStatus: string;
  options: string[];
}

export default function StatusUpdateButton({ orderId, currentStatus, options }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  async function handleChange(newStatus: string) {
    if (newStatus === status) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
      } else {
        alert('Failed to update status');
      }
    } catch {
      alert('Failed to update status');
    }
    setUpdating(false);
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={updating}
      className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 ${
        statusColors[status] ?? 'bg-gray-100 text-gray-800'
      }`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  );
}
