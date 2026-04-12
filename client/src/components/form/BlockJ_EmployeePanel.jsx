// Row defined OUTSIDE to avoid React remounting it on every re-render
function Row({ label, value }) {
  return (
    <div className="flex py-2 border-b border-blue-100 last:border-0">
      <span className="text-blue-500 w-40 shrink-0 text-sm">{label}</span>
      <span className="text-gray-800 text-sm font-medium">{value || '—'}</span>
    </div>
  );
}

export default function BlockJ_EmployeePanel({ employee }) {
  if (!employee) return null;

  return (
    <div id="block-j" className="form-block bg-blue-50 border border-blue-200">
      <h3 className="section-label text-blue-700">J — Employee Details (Read-only, Auto-filled from HRMS)</h3>
      <Row label="Employee ID" value={employee.employeeId} />
      <Row label="Email" value={employee.email} />
      <Row label="Designation" value={employee.designation} />
      <Row label="Band" value={employee.band} />
      <Row label="Location / Department" value={employee.locationDept} />
    </div>
  );
}
