import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDateTime } from '../../utils/ageCalculator';

// Color-coded badge for patient type
function TypeBadge({ type }) {
  const styles = {
    Regular:   'bg-gray-100 text-gray-700',
    VIP:       'bg-amber-100 text-amber-700',
    Corporate: 'bg-blue-100 text-blue-700',
  };
  const icons = {
    VIP: '⭐ ',
    Corporate: '🏢 ',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
      {icons[type] || ''}{type}
    </span>
  );
}

// Card defined OUTSIDE Dashboard to avoid remounting on every re-render
function Card({ label, value, color = 'blue', icon }) {
  const gradients = {
    blue:   'from-blue-500 to-blue-600',
    green:  'from-emerald-500 to-emerald-600',
    purple: 'from-violet-500 to-violet-600',
    red:    'from-rose-500 to-rose-600',
  };
  return (
    <div className={`bg-gradient-to-br ${gradients[color]} rounded-xl p-5 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <span className="text-white/40">{icon}</span>
      </div>
      <p className="text-4xl font-black">{value ?? '—'}</p>
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

  if (loading) return (
    <div className="p-12 text-center">
      <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
      <p className="text-gray-500 text-sm">Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card label="Today's Registrations" value={stats?.today} color="blue"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} />
        <Card label="This Week" value={stats?.thisWeek} color="green"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
        <Card label="This Month" value={stats?.thisMonth} color="purple"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>} />
        <Card label="MLC Cases Today" value={stats?.mlcToday} color="red"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>} />
      </div>

      {/* By Patient Type */}
      {stats?.byType?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Today — By Patient Type</h3>
          <div className="space-y-2">
            {stats.byType.map((t) => (
              <div key={t.patient_type} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                <TypeBadge type={t.patient_type} />
                <span className="font-bold text-gray-900">{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* By Consultant */}
      {stats?.byConsultant?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">Today — By Consultant</h3>
          <div className="space-y-2">
            {stats.byConsultant.map((c) => (
              <div key={c.consultant} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 text-sm">{c.consultant}</span>
                <span className="font-bold text-gray-900">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Last 20 Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-semibold">UID</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Registered By</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={r.uid} className={`border-b border-gray-50 hover:bg-blue-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                  <td className="px-5 py-3 font-mono text-blue-700 font-medium">{r.uid}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{r.first_name} {r.last_name}</td>
                  <td className="px-5 py-3"><TypeBadge type={r.patient_type} /></td>
                  <td className="px-5 py-3 text-gray-500">{formatDateTime(r.created_at)}</td>
                  <td className="px-5 py-3 text-gray-500">{r.registered_by}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-8 text-center text-gray-400">No registrations yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
