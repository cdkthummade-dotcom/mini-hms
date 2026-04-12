import { useState, useEffect } from 'react';
import { usePincodeAutofill } from '../../hooks/useAutofill';

export default function BlockE_Address({ data, onChange, autoFilled = {} }) {
  const [areas, setAreas] = useState([]);
  const [manualMode, setManualMode] = useState(false);

  const handlePincodeFill = (result, offline) => {
    if (offline || !result) {
      setManualMode(true);
      setAreas([]);
      return;
    }
    setAreas(result.areas || []);
    setManualMode(false);
    onChange({
      city: result.city,
      district: result.district,
      state: result.state,
      area: result.areas?.length === 1 ? result.areas[0] : '',
    });
  };

  const { lookup, loading: pincodeLoading, message: pincodeMsg } = usePincodeAutofill(handlePincodeFill);

  const handleSameAddress = (checked) => {
    onChange({ sameAddress: checked, permanentAddress: checked ? data.currentAddress : '' });
  };

  return (
    <div id="block-e" className="form-block">
      <h3 className="section-label">E — Address</h3>

      {/* Pincode */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="field-label">Pincode <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit pincode"
              value={data.pincode || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                onChange({ pincode: val });
                if (val.length === 6) lookup(val);
              }}
              className={`field-input ${autoFilled.pincode ? 'bg-blue-50' : ''}`}
            />
            {pincodeLoading && (
              <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          {pincodeMsg && <p className="text-amber-600 text-xs mt-1">{pincodeMsg}</p>}
        </div>

        {/* Area */}
        <div>
          <label className="field-label">Area</label>
          {!manualMode && areas.length > 1 ? (
            <select
              value={data.area || ''}
              onChange={(e) => onChange({ area: e.target.value })}
              className="field-input"
            >
              <option value="">Select area</option>
              {areas.map((a) => <option key={a}>{a}</option>)}
            </select>
          ) : (
            <input
              type="text"
              value={data.area || ''}
              onChange={(e) => onChange({ area: e.target.value })}
              placeholder="Area / locality"
              className={`field-input ${autoFilled.area ? 'bg-blue-50' : ''}`}
            />
          )}
        </div>

        {/* City */}
        <div>
          <label className="field-label">City <span className="text-red-500">*</span></label>
          <input type="text" value={data.city || ''} onChange={(e) => onChange({ city: e.target.value })}
            placeholder="City"
            className={`field-input ${autoFilled.city ? 'bg-blue-50' : ''}`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* District */}
        <div>
          <label className="field-label">District <span className="text-red-500">*</span></label>
          <input type="text" value={data.district || ''} onChange={(e) => onChange({ district: e.target.value })}
            placeholder="District"
            className={`field-input ${autoFilled.district ? 'bg-blue-50' : ''}`} />
        </div>

        {/* State */}
        <div>
          <label className="field-label">State <span className="text-red-500">*</span></label>
          <input type="text" value={data.state || ''} onChange={(e) => onChange({ state: e.target.value })}
            placeholder="State"
            className={`field-input ${autoFilled.state ? 'bg-blue-50' : ''}`} />
        </div>
      </div>

      {/* Current Address */}
      <div className="mb-4">
        <label className="field-label">Current Address <span className="text-red-500">*</span></label>
        <textarea maxLength={500} rows={2} value={data.currentAddress || ''}
          onChange={(e) => {
            onChange({ currentAddress: e.target.value });
            if (data.sameAddress) onChange({ permanentAddress: e.target.value });
          }}
          className={`field-input resize-none ${autoFilled.currentAddress ? 'bg-blue-50' : ''}`} />
      </div>

      {/* Permanent Address */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="field-label mb-0">Permanent Address <span className="text-red-500">*</span></label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
            <input type="checkbox" checked={data.sameAddress || false}
              onChange={(e) => handleSameAddress(e.target.checked)}
              className="accent-blue-600" />
            Same as Current Address
          </label>
        </div>
        <textarea maxLength={500} rows={2} value={data.permanentAddress || ''}
          onChange={(e) => onChange({ permanentAddress: e.target.value })}
          disabled={data.sameAddress}
          className={`field-input resize-none ${data.sameAddress ? 'bg-gray-50 opacity-70' : ''} ${autoFilled.permanentAddress ? 'bg-blue-50' : ''}`} />
      </div>
    </div>
  );
}
