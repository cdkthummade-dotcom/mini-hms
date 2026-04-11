import { useMasters } from '../../context/MasterDataContext';

export default function BlockF_Clinical({ data, onChange }) {
  const { masters } = useMasters();

  const addIdentity = () => onChange({ identities: [...(data.identities || []), { identityTypeId: '', identityNumber: '' }] });
  const updateIdentity = (i, field, val) => {
    const ids = [...(data.identities || [])];
    ids[i] = { ...ids[i], [field]: val };
    onChange({ identities: ids });
  };
  const removeIdentity = (i) => {
    const ids = [...(data.identities || [])];
    ids.splice(i, 1);
    onChange({ identities: ids });
  };

  return (
    <div id="block-f" className="form-block">
      <h3 className="section-label">F — Clinical</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Patient Type */}
        <div>
          <label className="field-label">Patient Type <span className="text-red-500">*</span></label>
          <select value={data.patientTypeId || ''} onChange={(e) => onChange({ patientTypeId: e.target.value })} className="field-input">
            <option value="">Select type</option>
            {masters.patientType.map((pt) => <option key={pt.id} value={pt.id}>{pt.value}</option>)}
          </select>
        </div>

        {/* Referred By */}
        <div>
          <label className="field-label">Referred By <span className="text-red-500">*</span></label>
          <select value={data.referredById || ''} onChange={(e) => onChange({ referredById: e.target.value })} className="field-input">
            <option value="">Select referral</option>
            {masters.referredBy.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        {/* Consultant */}
        <div>
          <label className="field-label">Consultant Doctor</label>
          <select value={data.consultantId || ''} onChange={(e) => onChange({ consultantId: e.target.value })} className="field-input">
            <option value="">Select consultant</option>
            {masters.consultant.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.department}</option>)}
          </select>
        </div>
      </div>

      {/* Identity Documents */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="field-label mb-0">Identity Documents</label>
          <button type="button" onClick={addIdentity}
            className="text-blue-600 text-sm underline hover:no-underline">+ Add Another</button>
        </div>
        {(data.identities || []).map((id, i) => (
          <div key={i} className="flex gap-3 mb-2 items-center">
            <select
              value={id.identityTypeId}
              onChange={(e) => updateIdentity(i, 'identityTypeId', e.target.value)}
              className="field-input w-44 shrink-0"
            >
              <option value="">— Select Type —</option>
              {masters.identityType.map((it) => <option key={it.id} value={it.id}>{it.value}</option>)}
            </select>
            <input
              type="text"
              maxLength={150}
              placeholder="Document number"
              value={id.identityNumber}
              onChange={(e) => updateIdentity(i, 'identityNumber', e.target.value)}
              className="field-input flex-1"
            />
            <button type="button" onClick={() => removeIdentity(i)}
              className="text-red-400 hover:text-red-600 text-xl shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-red-50">
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
