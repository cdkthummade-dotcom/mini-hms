import { useState } from 'react';
import { useEmployeeAutofill } from '../../hooks/useAutofill';

export default function BlockA_EmployeeFlag({ isEmployee, onToggle, onEmployeeFetched }) {
  const [empId, setEmpId] = useState('');
  const { fetch, loading, error } = useEmployeeAutofill(onEmployeeFetched);

  return (
    <div id="block-a" className="form-block">
      <h3 className="section-label">A — Employee Status</h3>
      <div className="flex gap-6 items-center mb-4">
        <span className="text-sm text-gray-700 font-medium">Is this patient a hospital employee?</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="isEmployee" value="no" checked={!isEmployee} onChange={() => onToggle(false)} className="accent-blue-600" />
          <span className="text-sm">No</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="isEmployee" value="yes" checked={isEmployee} onChange={() => onToggle(true)} className="accent-blue-600" />
          <span className="text-sm">Yes</span>
        </label>
      </div>

      {isEmployee && (
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <label className="field-label">Employee ID</label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value.toUpperCase())}
              placeholder="e.g. EMP001"
              className="field-input"
              onKeyDown={(e) => e.key === 'Enter' && fetch(empId)}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button
            type="button"
            onClick={() => fetch(empId)}
            disabled={loading || !empId}
            className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Fetch
          </button>
        </div>
      )}
    </div>
  );
}
