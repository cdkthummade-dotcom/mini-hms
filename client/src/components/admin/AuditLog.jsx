import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatDateTime } from '../../utils/ageCalculator';

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
  RESTORE: 'bg-purple-100 text-purple-700',
};

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ action: '', fromDate: '', toDate: '' });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(1); }, []); // eslint-disable-line

  // overrideFilters allows Clear to pass empty filters without waiting
  // for React to flush the setFilters state update (state is async).
  async function load(p = 1, overrideFilters) {
    setLoading(true);
    const activeFilters = overrideFilters !== undefined ? overrideFilters : filters;
    try {
      const { data } = await api.get('/api/audit/log', {
        params: { page: p, ...activeFilters },
      });
      setLogs(data.logs);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  const isSuperAdmin = user?.role === 'superadmin';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Audit Log</h2>
      {!isSuperAdmin && <p className="text-sm text-gray-500 mb-4">Showing action history. Log in as Super Admin to see IP/device details.</p>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={filters.action} onChange={(e) => setFilters({ ...filters, action: e.target.value })} className="field-input w-40">
          <option value="">All Actions</option>
          <option>CREATE</option>
          <option>UPDATE</option>
          <option>DELETE</option>
          <option>RESTORE</option>
        </select>
        <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="field-input w-40" />
        <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="field-input w-40" />
        <button onClick={() => load(1)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Apply</button>
        <button
          onClick={() => {
            const empty = { action: '', fromDate: '', toDate: '' };
            setFilters(empty);
            load(1, empty); // pass directly — don't rely on stale state
          }}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
        >Clear</button>
      </div>

      {loading && <p className="text-gray-500 text-sm mb-4">Loading...</p>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">Changed By</th>
              {isSuperAdmin && <th className="px-4 py-3">IP</th>}
              {isSuperAdmin && <th className="px-4 py-3">Device</th>}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan={isSuperAdmin ? 6 : 4} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No audit log entries found.
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} onClick={() => setSelected(selected?.id === log.id ? null : log)}
                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500">{formatDateTime(log.performed_at)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${ACTION_COLORS[log.action] || ''}`}>{log.action}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{log.table_name} #{log.record_id}</td>
                <td className="px-4 py-3">{log.performed_by_name}</td>
                {isSuperAdmin && <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ip_address || '—'}</td>}
                {isSuperAdmin && <td className="px-4 py-3 text-gray-500 text-xs">{log.device_info || '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Diff viewer */}
        {selected && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Change Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">Old Values</p>
                <pre className="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto max-h-40">
                  {selected.old_values ? JSON.stringify(selected.old_values, null, 2) : 'N/A (new record)'}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">New Values</p>
                <pre className="text-xs bg-white border border-gray-200 rounded p-3 overflow-auto max-h-40">
                  {selected.new_values ? JSON.stringify(selected.new_values, null, 2) : '—'}
                </pre>
              </div>
            </div>
            {isSuperAdmin && selected.user_agent && (
              <p className="text-xs text-gray-400 mt-2">Browser: {selected.user_agent.slice(0, 100)}...</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 50 && (
        <div className="flex justify-center gap-2 mt-4">
          {page > 1 && <button onClick={() => load(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">← Prev</button>}
          <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {Math.ceil(total / 50)}</span>
          {page < Math.ceil(total / 50) && <button onClick={() => load(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Next →</button>}
        </div>
      )}
    </div>
  );
}
