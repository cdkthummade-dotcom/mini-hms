export default function BlockD_Contact({ data, onChange, autoFilled = {} }) {
  return (
    <div id="block-d" className="form-block">
      <h3 className="section-label">D — Contact</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="field-label">Mobile Number <span className="text-red-500">*</span></label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile"
              value={data.mobile || ''}
              onChange={(e) => onChange({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className={`field-input rounded-l-none ${autoFilled.mobile ? 'bg-blue-50' : ''}`}
            />
          </div>
        </div>
        <div>
          <label className="field-label">Alternate Mobile</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-100 text-gray-600 text-sm rounded-l-lg">+91</span>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit (optional)"
              value={data.alternateMobile || ''}
              onChange={(e) => onChange({ alternateMobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="field-input rounded-l-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
