'use client';

import { useState, useEffect } from 'react';
import { Users as UsersIcon } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

const ROLE_OPTIONS = ['customer', 'admin', 'salesman'];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);

  async function loadUsers() {
    setFetching(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users ?? data ?? []);
    } catch {
      // ignore
    }
    setFetching(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(userId: string, newRole: string) {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch {
      alert('Failed to update role');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UsersIcon className="text-gray-900" size={24} />
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b bg-gray-50">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Phone</th>
                <th className="px-6 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{user.phone ?? '—'}</td>
                    <td className="px-6 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-full border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
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
