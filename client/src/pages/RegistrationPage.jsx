import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMasters } from '../context/MasterDataContext';
import api from '../api/axios';

import BlockA_EmployeeFlag from '../components/form/BlockA_EmployeeFlag';
import BlockB_Identity from '../components/form/BlockB_Identity';
import BlockC_Demographics from '../components/form/BlockC_Demographics';
import BlockD_Contact from '../components/form/BlockD_Contact';
import BlockE_Address from '../components/form/BlockE_Address';
import BlockF_Clinical from '../components/form/BlockF_Clinical';
import BlockG_MLC from '../components/form/BlockG_MLC';
import BlockH_Personal from '../components/form/BlockH_Personal';
import BlockI_Relation from '../components/form/BlockI_Relation';
import BlockJ_EmployeePanel from '../components/form/BlockJ_EmployeePanel';
import ReviewScreen from '../components/shared/ReviewScreen';
import UIDConfirmation from '../components/shared/UIDConfirmation';
import SessionTimer from '../components/shared/SessionTimer';

const SECTIONS = [
  { id: 'block-a', label: 'A Employee' },
  { id: 'block-b', label: 'B Identity' },
  { id: 'block-c', label: 'C Demographics' },
  { id: 'block-d', label: 'D Contact' },
  { id: 'block-e', label: 'E Address' },
  { id: 'block-f', label: 'F Clinical' },
  { id: 'block-g', label: 'G MLC' },
  { id: 'block-h', label: 'H Personal' },
  { id: 'block-i', label: 'I Relation' },
];

const INITIAL_FORM = {
  isEmployee: false, employeeId: null, photoUrl: null,
  salutationId: '', firstName: '', middleName: '', lastName: '',
  gender: '', dob: '', ageYears: 0, ageMonths: 0, ageDays: 0,
  mobile: '', alternateMobile: '',
  pincode: '', area: '', city: '', district: '', state: '',
  currentAddress: '', permanentAddress: '', sameAddress: false,
  patientTypeId: '', referredById: '', consultantId: '',
  bloodGroup: '', maritalStatusId: '',
  isMlc: false, mlcAccompaniedBy: '', mlcAccompaniedPhone: '', mlcPoliceBatchNo: '',
  mlcIncidentSpot: '', mlcRemarks: '', mlcDocumentUrl: '',
  identities: [],
  relationTypeId: '', relationName: '', relationPhone: '', relationAddress: '',
};

export default function RegistrationPage() {
  const { user, logout } = useAuth();
  const { masters } = useMasters();
  const [form, setForm] = useState(INITIAL_FORM);
  const [employee, setEmployee] = useState(null);
  const [autoFilled, setAutoFilled] = useState({});
  const [stage, setStage] = useState('form'); // 'form' | 'review' | 'success'
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const update = useCallback((partial) => setForm((prev) => ({ ...prev, ...partial })), []);

  const handleEmployeeFetched = useCallback((emp) => {
    setEmployee(emp);
    const filled = {};
    const updates = {};
    const fields = ['salutationId', 'firstName', 'middleName', 'lastName', 'gender', 'dob', 'mobile', 'pincode', 'area', 'city', 'district', 'state', 'currentAddress', 'permanentAddress'];

    // Map employee fields to form fields
    if (emp.salutation) {
      const sal = masters.salutation.find((s) => s.value === emp.salutation);
      if (sal) { updates.salutationId = sal.id; filled.salutationId = true; }
    }
    if (emp.firstName) { updates.firstName = emp.firstName; filled.firstName = true; }
    if (emp.middleName) { updates.middleName = emp.middleName; filled.middleName = true; }
    if (emp.lastName) { updates.lastName = emp.lastName; filled.lastName = true; }
    if (emp.gender) { updates.gender = emp.gender; filled.gender = true; }
    if (emp.dob) { updates.dob = emp.dob; filled.dob = true; }
    if (emp.mobile) { updates.mobile = emp.mobile; filled.mobile = true; }
    if (emp.pincode) { updates.pincode = emp.pincode; filled.pincode = true; }
    if (emp.area) { updates.area = emp.area; filled.area = true; }
    if (emp.city) { updates.city = emp.city; filled.city = true; }
    if (emp.district) { updates.district = emp.district; filled.district = true; }
    if (emp.state) { updates.state = emp.state; filled.state = true; }
    if (emp.currentAddress) { updates.currentAddress = emp.currentAddress; filled.currentAddress = true; }
    if (emp.permanentAddress) { updates.permanentAddress = emp.permanentAddress; filled.permanentAddress = true; }

    updates.employeeId = emp.employeeId;
    setForm((prev) => ({ ...prev, ...updates }));
    setAutoFilled(filled);
  }, [masters.salutation]);

  const validate = () => {
    const errs = [];
    if (!form.salutationId) errs.push('Salutation is required');
    if (!form.firstName?.trim()) errs.push('First Name is required');
    if (!form.lastName?.trim()) errs.push('Last Name is required');
    if (!form.gender) errs.push('Gender is required');
    if (!form.mobile || !/^\d{10}$/.test(form.mobile)) errs.push('Valid 10-digit mobile is required');
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) errs.push('Valid 6-digit pincode is required');
    if (!form.city?.trim()) errs.push('City is required');
    if (!form.district?.trim()) errs.push('District is required');
    if (!form.state?.trim()) errs.push('State is required');
    if (!form.currentAddress?.trim()) errs.push('Current Address is required');
    if (!form.permanentAddress?.trim()) errs.push('Permanent Address is required');
    if (!form.patientTypeId) errs.push('Patient Type is required');
    if (!form.referredById) errs.push('Referred By is required');
    return errs;
  };

  const handleSaveClick = () => {
    const errs = validate();
    if (errs.length) { setErrors(errs); window.scrollTo(0, 0); return; }
    setErrors([]);
    setStage('review');
    window.scrollTo(0, 0);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = {
        isEmployee: form.isEmployee,
        employeeId: form.isEmployee ? form.employeeId : null,
        photoUrl: form.photoUrl,
        salutationId: form.salutationId || null,
        firstName: form.firstName,
        middleName: form.middleName || null,
        lastName: form.lastName,
        gender: form.gender,
        dob: form.dob || null,
        ageYears: form.ageYears || 0,
        ageMonths: form.ageMonths || 0,
        ageDays: form.ageDays || 0,
        mobile: form.mobile,
        alternateMobile: form.alternateMobile || null,
        pincode: form.pincode,
        area: form.area || null,
        city: form.city,
        district: form.district,
        state: form.state,
        currentAddress: form.currentAddress,
        permanentAddress: form.permanentAddress,
        sameAddress: form.sameAddress || false,
        patientTypeId: parseInt(form.patientTypeId),
        referredById: parseInt(form.referredById),
        consultantId: form.consultantId ? parseInt(form.consultantId) : null,
        bloodGroup: form.bloodGroup || null,
        maritalStatusId: form.maritalStatusId ? parseInt(form.maritalStatusId) : null,
        isMlc: form.isMlc || false,
        mlcAccompaniedBy: form.mlcAccompaniedBy || null,
        mlcAccompaniedPhone: form.mlcAccompaniedPhone || null,
        mlcPoliceBatchNo: form.mlcPoliceBatchNo || null,
        mlcIncidentSpot: form.mlcIncidentSpot || null,
        mlcRemarks: form.mlcRemarks || null,
        mlcDocumentUrl: form.mlcDocumentUrl || null,
        identities: (form.identities || []).filter((id) => id.identityTypeId && id.identityNumber),
        relations: form.relationTypeId && form.relationName ? [{
          relationTypeId: parseInt(form.relationTypeId),
          name: form.relationName,
          phone: form.relationPhone || null,
          address: form.relationAddress || null,
        }] : [],
      };

      const { data } = await api.post('/api/patients', payload);

      // Build display labels for confirmation screen
      const sal = masters.salutation.find((s) => String(s.id) === String(form.salutationId));
      const pt = masters.patientType.find((p) => String(p.id) === String(form.patientTypeId));
      const cons = masters.consultant.find((c) => String(c.id) === String(form.consultantId));

      setResult({
        uid: data.uid,
        warnings: data.warnings || [],
        patient: {
          ...form,
          salutation: sal?.value || '',
          patientTypeName: pt?.value || '',
          consultantName: cons?.name || '',
        },
      });
      setStage('success');
      window.scrollTo(0, 0);
    } catch (err) {
      setErrors([err.response?.data?.error || 'Registration failed. Please try again.']);
      setStage('form');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEmployee(null);
    setAutoFilled({});
    setResult(null);
    setErrors([]);
    setStage('form');
    window.scrollTo(0, 0);
  };

  // ── SUCCESS STAGE ──
  if (stage === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <h1 className="font-bold text-blue-800">Demo Hospital — Registration</h1>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
          </div>
          <div className="max-w-4xl mx-auto mt-2"><SessionTimer /></div>
        </header>
        {result?.warnings?.length > 0 && (
          <div className="max-w-2xl mx-auto mt-4 px-4">
            {result.warnings.map((w, i) => (
              <div key={i} className="bg-orange-50 border border-orange-300 text-orange-700 rounded-lg px-4 py-3 text-sm mb-2">{w}</div>
            ))}
          </div>
        )}
        <UIDConfirmation uid={result.uid} patient={result.patient} onRegisterAnother={resetForm} />
      </div>
    );
  }

  // ── REVIEW STAGE ──
  if (stage === 'review') {
    const sal = masters.salutation.find((s) => String(s.id) === String(form.salutationId));
    const pt = masters.patientType.find((p) => String(p.id) === String(form.patientTypeId));
    const rb = masters.referredBy.find((r) => String(r.id) === String(form.referredById));
    const cons = masters.consultant.find((c) => String(c.id) === String(form.consultantId));
    const ms = masters.maritalStatus.find((m) => String(m.id) === String(form.maritalStatusId));

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <h1 className="font-bold text-blue-800">Demo Hospital — Registration</h1>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">Logout</button>
          </div>
          <div className="max-w-4xl mx-auto mt-2"><SessionTimer /></div>
        </header>
        <ReviewScreen
          formData={{
            ...form,
            salutation: sal?.value || '',
            patientTypeName: pt?.value || '',
            referredByName: rb?.name || '',
            consultantName: cons?.name || '',
            maritalStatusName: ms?.value || '',
          }}
          onEdit={() => { setStage('form'); window.scrollTo(0, 0); }}
          onConfirm={handleConfirm}
          submitting={submitting}
        />
      </div>
    );
  }

  // ── FORM STAGE ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm print:hidden">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="font-bold text-blue-800 text-lg">Demo Hospital — Patient Registration</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.fullName}</span>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-1"><SessionTimer /></div>
      </header>

      <div className="max-w-7xl mx-auto flex gap-0">
        {/* Sticky Section Nav — pure CSS positioning */}
        <nav className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20 pt-6 pb-6 pl-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Sections</p>
            <ul className="space-y-1">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}
                    className="block text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Form */}
        <main className="flex-1 px-4 py-6 min-w-0">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-700 font-medium mb-1">Please fix the following errors:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {errors.map((e, i) => <li key={i} className="text-red-600 text-sm">{e}</li>)}
              </ul>
            </div>
          )}

          <BlockA_EmployeeFlag
            isEmployee={form.isEmployee}
            onToggle={(val) => { update({ isEmployee: val }); if (!val) { setEmployee(null); setAutoFilled({}); } }}
            onEmployeeFetched={handleEmployeeFetched}
          />
          <BlockB_Identity data={form} onChange={update} autoFilled={autoFilled} />
          <BlockC_Demographics data={form} onChange={update} autoFilled={autoFilled} />
          <BlockD_Contact data={form} onChange={update} autoFilled={autoFilled} />
          <BlockE_Address data={form} onChange={update} autoFilled={autoFilled} />
          <BlockF_Clinical data={form} onChange={update} />
          <BlockG_MLC data={form} onChange={update} />
          <BlockH_Personal data={form} onChange={update} />
          <BlockI_Relation data={form} onChange={update} />
          {form.isEmployee && <BlockJ_EmployeePanel employee={employee} />}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSaveClick}
              className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-md"
            >
              Save & Review
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
