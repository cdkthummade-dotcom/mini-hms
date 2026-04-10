import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { formatDate, formatDateTime } from '../../utils/ageCalculator';
import PrintReceipt from '../shared/PrintReceipt';

export default function PatientRecord({ uid, onBack }) {
  const [patient, setPatient] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/api/patients/${uid}`).then(({ data }) => {
      setPatient(data);
      setForm(data);
      setLoading(false);
    });
  }, [uid]);

  async function save() {
    setSaving(true);
    try {
      await api.put(`/api/patients/${patient.id}`, {
        firstName: form.first_name,
        lastName: form.last_name,
        mobile: form.mobile,
        city: form.city,
        currentAddress: form.current_address,
        permanentAddress: form.permanent_address,
        bloodGroup: form.blood_group,
      });
      setPatient({ ...patient, ...form });
      setEditMode(false);
      setMsg('Patient record updated.');
    } catch (err) {
      setMsg(err.response?.data?.error || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  async function softDelete() {
    if (!confirm('Soft delete this patient? The record will be hidden but never removed from the database.')) return;
    await api.delete(`/api/patients/${patient.id}`);
    setMsg('Patient soft-deleted.');
    setPatient({ ...patient, is_deleted: true });
  }

  async function restore() {
    await api.post(`/api/patients/${patient.id}/restore`);
    setMsg('Patient restored.');
    setPatient({ ...patient, is_deleted: false });
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!patient) return <div className="p-8 text-center text-red-500">Patient not found</div>;

  const Field = ({ label, value, editKey, readOnly }) => (
    <div>
      <label className="field-label">{label}</label>
      {editMode && editKey && !readOnly ? (
        <input type="text" value={form[editKey] || ''} onChange={(e) => setForm({ ...form, [editKey]: e.target.value })} className="field-input" />
      ) : (
        <p className="text-gray-800 text-sm">{value || '—'}</p>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-blue-600 hover:underline text-sm">← Back to Search</button>
        <h2 className="text-xl font-bold text-gray-800">Patient Record — {patient.uid}</h2>
        {patient.is_deleted && <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">DELETED</span>}
        {patient.is_mlc && <span className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">MLC</span>}
      </div>

      {msg && <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg px-4 py-3 mb-4 text-sm">{msg}</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Field label="Full Name" value={`${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`} />
          <Field label="First Name" editKey="first_name" value={patient.first_name} />
          <Field label="Last Name" editKey="last_name" value={patient.last_name} />
          <Field label="Gender" value={patient.gender} />
          <Field label="Date of Birth" value={formatDate(patient.dob)} />
          <Field label="Age" value={`${patient.age_years} Yrs ${patient.age_months} Mo ${patient.age_days} Days`} />
          <Field label="Mobile" editKey="mobile" value={`+91 ${patient.mobile}`} />
          <Field label="City" editKey="city" value={patient.city} />
          <Field label="State" value={patient.state} />
          <Field label="Current Address" editKey="current_address" value={patient.current_address} />
          <Field label="Blood Group" editKey="blood_group" value={patient.blood_group} />
          <Field label="Patient Type" value={patient.patient_type} readOnly />
          <Field label="Consultant" value={patient.consultant} readOnly />
          <Field label="Referred By" value={patient.referred_by} readOnly />
          <Field label="Registered By" value={patient.registered_by} readOnly />
          <Field label="Registered At" value={formatDateTime(patient.created_at)} readOnly />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        {!patient.is_deleted ? (
          <>
            {editMode ? (
              <>
                <button onClick={save} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditMode(false); setForm(patient); }} className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
                Edit Record
              </button>
            )}
            <button onClick={softDelete} className="border border-red-300 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50">
              Delete (Soft)
            </button>
          </>
        ) : (
          <button onClick={restore} className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700">
            Restore Patient
          </button>
        )}
        <PrintReceipt
          uid={patient.uid}
          patient={{
            salutation: patient.salutation || '',
            firstName: patient.first_name,
            middleName: patient.middle_name,
            lastName: patient.last_name,
            gender: patient.gender,
            dob: patient.dob,
            ageYears: patient.age_years,
            ageMonths: patient.age_months,
            ageDays: patient.age_days,
            mobile: patient.mobile,
            patientTypeName: patient.patient_type,
            consultantName: patient.consultant,
            isMlc: patient.is_mlc,
          }}
        />
      </div>
    </div>
  );
}
