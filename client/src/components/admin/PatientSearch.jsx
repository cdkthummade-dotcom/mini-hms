import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../api/axios';
import { formatDate, formatDateTime } from '../../utils/ageCalculator';
import PatientRecord from './PatientRecord';

// Color-coded badge for patient type
function TypeBadge({ type }) {
  const styles = {
    Regular:   'bg-gray-100 text-gray-700',
    VIP:       'bg-amber-100 text-amber-700',
    Corporate: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[type] || 'bg-gray-100 text-gray-700'}`}>
      {type}
    </span>
  );
}

export default function PatientSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selected, setSelected] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef(null);

  async function search(p = 1, overrideShowDeleted, query) {
    setLoading(true);
    try {
      const deleted = overrideShowDeleted !== undefined ? overrideShowDeleted : showDeleted;
      const searchQuery = query !== undefined ? query : q;
      const { data } = await api.get('/api/patients/search', { params: { q: searchQuery, page: p, showDeleted: deleted } });
      setResults(data.patients);
      setTotal(data.total);
      setPage(p);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }

  // Auto-search debounce after 3+ characters
  const handleInputChange = useCallback((val) => {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 3) {
      debounceRef.current = setTimeout(() => {
        search(1, undefined, val);
      }, 500);
    }
  }, [showDeleted]);

  // Cleanup on unmount
  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  if (selected) {
    return <PatientRecord uid={selected} onBack={() => { setSelected(null); search(page); }} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Patient Records</h2>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search(1)}
            placeholder="Search by UID, Name, or Mobile..."
            className="field-input pl-10"
          />
        </div>
        <button onClick={() => search(1)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all flex items-center gap-2">
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Search
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={showDeleted} onChange={(e) => { setShowDeleted(e.target.checked); search(1, e.target.checked); }} className="accent-blue-600 w-4 h-4" />
          Show deleted
        </label>
      </div>

      {/* Empty State — Before searching */}
      {!hasSearched && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="text-gray-300 mb-4 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Search Patient Records</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Enter a UID, patient name, or mobile number to find records. Auto-search starts after 3 characters.
          </p>
        </div>
      )}

      {/* No results */}
      {hasSearched && results.length === 0 && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
          <div className="text-gray-300 mb-4 flex justify-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No patients found</h3>
          <p className="text-gray-400 text-sm">Try a different search term or check the "Show deleted" option.</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-3">{total} result(s) found</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 font-semibold">UID</th>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Gender</th>
                  <th className="px-5 py-3 font-semibold">Mobile</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.uid}
                    onClick={() => setSelected(r.uid)}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-blue-50/50 transition-colors ${r.is_deleted ? 'opacity-50' : ''} ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-5 py-3 font-mono text-blue-700 font-medium">{r.uid}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{r.first_name} {r.last_name}</td>
                    <td className="px-5 py-3 text-gray-600">{r.gender}</td>
                    <td className="px-5 py-3 text-gray-600">+91 {r.mobile}</td>
                    <td className="px-5 py-3"><TypeBadge type={r.patient_type} /></td>
                    <td className="px-5 py-3 text-gray-500">{formatDateTime(r.created_at)}</td>
                    <td className="px-5 py-3">
                      {r.is_deleted
                        ? <span className="bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">Deleted</span>
                        : r.is_mlc
                          ? <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">MLC</span>
                          : <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Active</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              {page > 1 && <button onClick={() => search(page - 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">← Prev</button>}
              <span className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg">Page {page} of {Math.ceil(total / 20)}</span>
              {page < Math.ceil(total / 20) && <button onClick={() => search(page + 1)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">Next →</button>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
