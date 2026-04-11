import { useMasters } from '../../context/MasterDataContext';

export default function BlockI_Relation({ data, onChange }) {
  const { masters } = useMasters();

  return (
    <div id="block-i" className="form-block">
      <h3 className="section-label">I — Relation / Attendant</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Relation Type</label>
          <select value={data.relationTypeId || ''} onChange={(e) => onChange({ relationTypeId: e.target.value })} className="field-input">
            <option value="">Select</option>
            {masters.relationType.map((rt) => <option key={rt.id} value={rt.id}>{rt.value}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Relation Name</label>
          <input type="text" maxLength={150} value={data.relationName || ''}
            onChange={(e) => onChange({ relationName: e.target.value })} className="field-input" />
        </div>
        <div>
          <label className="field-label">Relation Phone</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">+91</span>
            <input type="tel" maxLength={10} value={data.relationPhone || ''}
              onChange={(e) => onChange({ relationPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="field-input rounded-l-none" />
          </div>
        </div>
        <div>
          <label className="field-label">Relation Address</label>
          <textarea maxLength={150} rows={2} value={data.relationAddress || ''}
            onChange={(e) => onChange({ relationAddress: e.target.value })}
            className="field-input resize-none" />
        </div>
      </div>
    </div>
  );
}
