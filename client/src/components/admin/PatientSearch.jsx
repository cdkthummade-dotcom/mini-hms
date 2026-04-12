import { useState } from 'react';
import api from '../../api/axios';
import { formatDate, formatDateTime } from '../../utils/ageCalculator';
import PatientRecord from './PatientRecord';

export default function PatientSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selected, setSelected] = useState(null);

  async function search(p = 1, overrideShowDeleted) {
    setLoading(true);
    try {
      const deleted = overrideShowDeleted !== undefined ? overrideShowDeleted : showDeleted;
      const { data } = await api.get('/api/patients/search', { params: { q, page: p, showDeleted: deleted } });
      setResults(data.patients);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  if (selected) {
    return <PatientRecord uid={selected} onBack={() => { setSelected(null); search(page); }} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Patient Records</h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && search(1)}
          placeholder="Search by UID, Name, or Mobile..."
          className="field-input flex-1"
        />
        <button onClick={() => search(1)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
          Search
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); search(1, e.target.checked); }} className="accent-blue-600" />
          Show deleted
        </label>
      </div>

      {loading && <p className="text-gray-500 text-sm mb-4">Searching...</p>}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-3">{total} result(s) found</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3">UID</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Mobile</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.uid}
                    onClick={() => setSelected(r.uid)}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50 ${r.is_deleted ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 font-mono text-blue-700 font-medium">{r.uid}</td>
                    <td className="px-4 py-3">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3">{r.gender}</td>
                    <td className="px-4 py-3">+91 {r.mobile}</td>
                    <td className="px-4 py-3">{r.patient_type}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDateTime(r.created_at)}</td>
                    <td className="px-4 py-3">
                      {r.is_deleted
                        ? <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded">Deleted</span>
                        : r.is_mlc
                          ? <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded">MLC</span>
                          : <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Active</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              {page > 1 && <button onClick={() => search(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">← Prev</button>}
              <span className="px-4 py-2 text-sm text-gray-600">Page {page} of {Math.ceil(total / 20)}</span>
              {page < Math.ceil(total / 20) && <button onClick={() => search(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Next →</button>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
