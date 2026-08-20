'use client';

import { useState, useEffect } from 'react';
import { Search, Edit2, Check, X } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  user_id: number;
  user_name: string;
  punch_in: string;
  punch_out: string | null;
  date: string;
}

export default function SupervisorAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPunchIn, setEditPunchIn] = useState('');
  const [editPunchOut, setEditPunchOut] = useState('');

  async function fetchRecords() {
    try {
      const res = await fetch('/api/attendance/all');
      const data = await res.json();
      setRecords(data.records || []);
    } catch {
      console.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  const filtered = records.filter(
    (r) => r.user_name?.toLowerCase().includes(search.toLowerCase()) || r.date.includes(search)
  );

  function startEdit(record: AttendanceRecord) {
    setEditingId(record.id);
    setEditPunchIn(record.punch_in ? new Date(record.punch_in).toISOString().slice(0, 16) : '');
    setEditPunchOut(record.punch_out ? new Date(record.punch_out).toISOString().slice(0, 16) : '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditPunchIn('');
    setEditPunchOut('');
  }

  async function saveEdit(id: number) {
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ punch_in: editPunchIn, punch_out: editPunchOut || null }),
      });
      if (res.ok) {
        setEditingId(null);
        await fetchRecords();
      }
    } catch {
      console.error('Failed to update attendance');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Attendance</h1>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name or date..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Salesman</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Punch In</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Punch Out</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No records found</td></tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id}>
                    <td className="px-4 py-3 font-medium">{record.user_name || `User #${record.user_id}`}</td>
                    <td className="px-4 py-3 text-gray-600">{record.date}</td>
                    <td className="px-4 py-3">
                      {editingId === record.id ? (
                        <input
                          type="datetime-local"
                          value={editPunchIn}
                          onChange={(e) => setEditPunchIn(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-40"
                        />
                      ) : (
                        <span className="text-gray-600">{record.punch_in ? new Date(record.punch_in).toLocaleTimeString() : '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === record.id ? (
                        <input
                          type="datetime-local"
                          value={editPunchOut}
                          onChange={(e) => setEditPunchOut(e.target.value)}
                          className="border rounded px-2 py-1 text-xs w-40"
                        />
                      ) : (
                        <span className="text-gray-600">{record.punch_out ? new Date(record.punch_out).toLocaleTimeString() : '-'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === record.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => saveEdit(record.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={cancelEdit} className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(record)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
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
