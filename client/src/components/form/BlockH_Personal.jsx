import { useMasters } from '../../context/MasterDataContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BlockH_Personal({ data, onChange }) {
  const { masters } = useMasters();

  return (
    <div id="block-h" className="form-block">
      <h3 className="section-label">H — Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Blood Group</label>
          <select value={data.bloodGroup || ''} onChange={(e) => onChange({ bloodGroup: e.target.value })} className="field-input">
            <option value="">Select</option>
            {BLOOD_GROUPS.map((bg) => <option key={bg}>{bg}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Marital Status</label>
          <select value={data.maritalStatusId || ''} onChange={(e) => onChange({ maritalStatusId: e.target.value })} className="field-input">
            <option value="">Select</option>
            {masters.maritalStatus.map((ms) => <option key={ms.id} value={ms.id}>{ms.value}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
