'use client';

import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, MapPin } from 'lucide-react';

interface AttendanceRecord {
  id: number;
  punch_in: string;
  punch_out: string | null;
  date: string;
}

export default function SalesmanAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  async function fetchRecords() {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      setRecords(data.records || []);
      const today = new Date().toISOString().split('T')[0];
      const todayRec = (data.records || []).find((r: AttendanceRecord) => r.date === today);
      setTodayRecord(todayRec || null);
    } catch {
      console.error('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecords();
  }, []);

  function getLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true }
      );
    });
  }

  async function handlePunchIn() {
    setPunching(true);
    try {
      const loc = await getLocation().catch(() => null);
      const res = await fetch('/api/attendance/punch-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: loc }),
      });
      if (res.ok) {
        await fetchRecords();
      }
    } catch {
      console.error('Punch in failed');
    } finally {
      setPunching(false);
    }
  }

  async function handlePunchOut() {
    setPunching(true);
    try {
      const loc = await getLocation().catch(() => null);
      const res = await fetch('/api/attendance/punch-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: loc }),
      });
      if (res.ok) {
        await fetchRecords();
      }
    } catch {
      console.error('Punch out failed');
    } finally {
      setPunching(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Clock className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {todayRecord ? (
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Punched in at <span className="font-medium">{new Date(todayRecord.punch_in).toLocaleTimeString()}</span>
              </p>
              {todayRecord.punch_out ? (
                <p className="text-sm text-gray-600">
                  Punched out at <span className="font-medium">{new Date(todayRecord.punch_out).toLocaleTimeString()}</span>
                </p>
              ) : (
                <button
                  onClick={handlePunchOut}
                  disabled={punching}
                  className="bg-red-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {punching ? 'Processing...' : 'Punch Out'}
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={handlePunchIn}
              disabled={punching}
              className="bg-green-600 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {punching ? 'Processing...' : 'Punch In'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800">Recent History</h2>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500 text-sm">Loading...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No records yet</div>
          ) : (
            records.slice(0, 14).map((record) => (
              <div key={record.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{record.date}</p>
                  <p className="text-xs text-gray-500">
                    In: {new Date(record.punch_in).toLocaleTimeString()}
                    {record.punch_out && ` — Out: ${new Date(record.punch_out).toLocaleTimeString()}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${record.punch_out ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {record.punch_out ? 'Complete' : 'Active'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
