import { formatDate } from '../../utils/ageCalculator';

export default function ReviewScreen({ formData, masterLabels, onEdit, onConfirm, submitting }) {
  const { salutation, firstName, middleName, lastName, gender, dob, ageYears, ageMonths, ageDays,
          mobile, alternateMobile, pincode, area, city, district, state,
          currentAddress, permanentAddress, patientTypeName, referredByName, consultantName,
          bloodGroup, maritalStatusName, isEmployee, employeeId, isMlc,
          mlcAccompaniedBy, mlcPoliceBatchNo, mlcIncidentSpot } = formData;

  const Row = ({ label, value }) => value ? (
    <div className="flex py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 w-40 shrink-0 text-sm">{label}</span>
      <span className="text-gray-900 text-sm font-medium">{value}</span>
    </div>
  ) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <h2 className="text-lg font-bold text-blue-800 mb-1">Review Registration Details</h2>
        <p className="text-blue-600 text-sm">Please verify all details before confirming. You cannot edit after saving.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6">
        {/* Identity */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Patient Identity</h3>
          <Row label="Full Name" value={`${salutation || ''} ${firstName || ''} ${middleName || ''} ${lastName || ''}`.trim()} />
          <Row label="Gender" value={gender} />
          <Row label="Date of Birth" value={formatDate(dob)} />
          <Row label="Age" value={`${ageYears} Yrs ${ageMonths} Mo ${ageDays} Days`} />
        </div>

        {/* Contact */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
          <Row label="Mobile" value={`+91 ${mobile}`} />
          {alternateMobile && <Row label="Alt Mobile" value={`+91 ${alternateMobile}`} />}
        </div>

        {/* Address */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Address</h3>
          <Row label="Pincode" value={pincode} />
          <Row label="Area" value={area} />
          <Row label="City / District" value={`${city}, ${district}`} />
          <Row label="State" value={state} />
          <Row label="Current Address" value={currentAddress} />
          <Row label="Permanent Address" value={permanentAddress} />
        </div>

        {/* Clinical */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Clinical</h3>
          <Row label="Patient Type" value={patientTypeName} />
          <Row label="Referred By" value={referredByName} />
          <Row label="Consultant" value={consultantName} />
          <Row label="Blood Group" value={bloodGroup} />
          <Row label="Marital Status" value={maritalStatusName} />
        </div>

        {/* Employee */}
        {isEmployee && (
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Employee</h3>
            <Row label="Employee ID" value={employeeId} />
          </div>
        )}

        {/* MLC */}
        {isMlc && (
          <div className="p-4 bg-red-50">
            <h3 className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-3">MLC — Medico-Legal Case</h3>
            <Row label="Accompanied By" value={mlcAccompaniedBy} />
            <Row label="Police Batch No" value={mlcPoliceBatchNo} />
            <Row label="Incident Spot" value={mlcIncidentSpot} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onEdit}
          disabled={submitting}
          className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 disabled:opacity-50"
        >
          Edit Application
        </button>
        <button
          onClick={onConfirm}
          disabled={submitting}
          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
          ) : 'Confirm & Save'}
        </button>
      </div>
    </div>
  );
}
