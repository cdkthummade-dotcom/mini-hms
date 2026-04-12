import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/ageCalculator';

// Card defined OUTSIDE Dashboard to avoid remounting on every re-render
function Card({ label, value, color = 'blue' }) {
  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-xl p-5`}>
      <p className={`text-${color}-500 text-sm font-medium`}>{label}</p>
      <p className={`text-${color}-900 text-4xl font-black mt-1`}>{value ?? '—'}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, r] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/dashboard/recent'),
        ]);
        setStats(s.data);
        setRecent(r.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card label="Today's Registrations" value={stats?.today} color="blue" />
        <Card label="This Week" value={stats?.thisWeek} color="green" />
        <Card label="This Month" value={stats?.thisMonth} color="purple" />
        <Card label="MLC Cases Today" value={stats?.mlcToday} color="red" />
      </div>

      {/* By Patient Type */}
      {stats?.byType?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Today — By Patient Type</h3>
          <div className="space-y-2">
            {stats.byType.map((t) => (
              <div key={t.patient_type} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 text-sm">{t.patient_type}</span>
                <span className="font-bold text-gray-900">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Consultant */}
      {stats?.byConsultant?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Today — By Consultant</h3>
          <div className="space-y-2">
            {stats.byConsultant.map((c) => (
              <div key={c.consultant} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 text-sm">{c.consultant}</span>
                <span className="font-bold text-gray-900">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-3">Last 20 Registrations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-2 pr-4">UID</th>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2">Registered By</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => (
                <tr key={r.uid} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 pr-4 font-mono text-blue-700 font-medium">{r.uid}</td>
                  <td className="py-2 pr-4">{r.first_name} {r.last_name}</td>
                  <td className="py-2 pr-4">{r.patient_type}</td>
                  <td className="py-2 pr-4 text-gray-500">{formatDateTime(r.created_at)}</td>
                  <td className="py-2 text-gray-500">{r.registered_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
